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

    async run(userId: string): Promise<void> {
        const recentlyPlayedTracks: PlayedTrack[] = await this.spotifyModel.getRecentlyPlayedTracks(userId);
        const lastSavedTrack: PlayedTrack = await this.getLastSavedTrack(userId);
        const tracksToBeSaved: PlayedTrack[] = this.filterOutTracksPreviouslySaved(recentlyPlayedTracks, lastSavedTrack);

        await this.playedTracksModel.savePlayedTracks(userId, tracksToBeSaved);
    }

    filterOutTracksPreviouslySaved(recentlyPlayedTracks: PlayedTrack[], lastSavedTrack?: PlayedTrack): PlayedTrack[] {
        if (lastSavedTrack) {
            return recentlyPlayedTracks.filter(track => track.playedAt > lastSavedTrack.playedAt);
        }

        return recentlyPlayedTracks;
    }

    async getLastSavedTrack(userId: string): Promise<PlayedTrack> {
        const lastSavedTrack: PlayedTrack = await this.playedTracksModel.getLastSavedTrack(userId);
        console.log(`The last saved track was: ${lastSavedTrack.trackName} (${lastSavedTrack.playedAt})`);

        return lastSavedTrack;
    }

    async savePlayedTracks(userId: string, playedTracks: PlayedTrack[]): Promise<void> {
        console.log(`Saving ${playedTracks.length} played tracks..`);
        return this.playedTracksModel.savePlayedTracks(userId, playedTracks);
    }
}