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

    async run(): Promise<void> {
        const enabledUsers: SpotifyUser[] = await this.spotifyModel.getEnabledUsers();
        console.log(`Found: ${enabledUsers.length} enabled users.`);

        await Bluebird.map(enabledUsers, (user) => this.runForUser(user.userId), { concurrency: 2 });
    }

    async runForUser(userId: string): Promise<void> {
        console.log(`Running save-played-tracks job for user: \'${userId}\'..`);

        const recentlyPlayedTracks: PlayedTrack[] = await this.spotifyModel.getRecentlyPlayedTracks(userId);
        const lastSavedPlayedTrack: PlayedTrack = await this.getLastSavedPlayedTrack(userId);
        const tracksToBeSaved: PlayedTrack[] = this.filterOutTracksPreviouslySaved(recentlyPlayedTracks, lastSavedPlayedTrack);

        return this.savePlayedTracks(tracksToBeSaved);
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
            console.log(`The last saved played track for \'${userId}\' was: ${lastSavedPlayedTrack.trackName} (${lastSavedPlayedTrack.playedAt}).`);
        } else {
            console.log(`User \'${userId}\' did not have any previously saved played track.`);
        }
        return lastSavedPlayedTrack;
    }

    async savePlayedTracks(playedTracks: PlayedTrack[]): Promise<void> {
        console.log(`Saving ${playedTracks.length} recently played tracks..`);
        return this.playedTracksModel.savePlayedTracks(playedTracks);
    }
}