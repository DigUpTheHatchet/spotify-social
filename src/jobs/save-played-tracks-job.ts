import { uniqueId } from 'lodash';
import { SpotifyModel } from '../models/spotify-model';
import { PlayedTracksModel } from '../models/played-tracks-model';
import { PlayedTrack, SpotifyUser } from '../ts';
import Bluebird from 'bluebird';

export class SavePlayedTracksJob {
    private spotifyModel: SpotifyModel;
    private playedTracksModel: PlayedTracksModel;

    constructor(spotifyModel: SpotifyModel, playedTracksModel: PlayedTracksModel) {
        this.spotifyModel = spotifyModel;
        this.playedTracksModel = playedTracksModel;
    }

    async run(): Promise<number> {
        const enabledUsers: SpotifyUser[] = await this.spotifyModel.getEnabledUsers();

        // TODO: Decide how we want to deal with one of these promises rejecting? Unit test this scenario
        await Bluebird.map(enabledUsers, (user) => this.runForUser(user.userId), { concurrency: 2 });

        return enabledUsers.length;
    }

    async runForUser(userId: string): Promise<number> {
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