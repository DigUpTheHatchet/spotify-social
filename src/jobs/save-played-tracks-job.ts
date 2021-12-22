import { uniqueId } from 'lodash';
import { SpotifyModel } from '../models/spotify-model';
import { PlayedTracksModel } from '../models/played-tracks-model';
import { PlayedTrack } from '../ts';

export class SavePlayedTracksJob {
    private jobId: string;
    private spotifyModel: SpotifyModel;
    private playedTracksModel: PlayedTracksModel;

    constructor(spotifyModel: SpotifyModel, playedTracksModel: PlayedTracksModel, jobId: string = uniqueId()) {
        this.spotifyModel = spotifyModel;
        this.playedTracksModel = playedTracksModel;
        this.jobId = jobId;
    }

    async run(userId: string): Promise<number> {
        const recentlyPlayedTracks: PlayedTrack[] = await this.spotifyModel.getRecentlyPlayedTracks(userId);
        const lastSavedPlayedTrack: PlayedTrack = await this.getLastSavedPlayedTrack(userId);
        const tracksToBeSaved: PlayedTrack[] = this.filterOutTracksPreviouslySaved(recentlyPlayedTracks, lastSavedPlayedTrack);

        return this.playedTracksModel.savePlayedTracks(tracksToBeSaved);
    }

    filterOutTracksPreviouslySaved(recentlyPlayedTracks: PlayedTrack[], lastPlayedTrack?: PlayedTrack): PlayedTrack[] {
        if (lastPlayedTrack) {
            return recentlyPlayedTracks.filter(track => track.playedAt > lastPlayedTrack.playedAt);
        }

        return recentlyPlayedTracks;
    }

    async getLastSavedPlayedTrack(userId: string): Promise<PlayedTrack> {
        const lastSavedPlayedTrack: PlayedTrack = await this.playedTracksModel.getLastSavedPlayedTrack(userId);

        if (lastSavedPlayedTrack) {
            console.log(`The last saved played track for \'${userId}\' was: ${lastSavedPlayedTrack.trackName} (${lastSavedPlayedTrack.playedAt})..`);
        } else {
            console.log(`User \'${userId}\' did not have any previously saved played track..`);
        }
        return lastSavedPlayedTrack;
    }

    async savePlayedTracks(playedTracks: PlayedTrack[]): Promise<number> {
        console.log(`Saving ${playedTracks.length} played tracks..`);
        return this.playedTracksModel.savePlayedTracks(playedTracks);
    }
}