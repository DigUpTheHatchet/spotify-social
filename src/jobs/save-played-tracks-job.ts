import { uniqueId } from 'lodash';
import SpotifyClient from '../services/spotify-client';
import { PlayedTracksModel } from '../models/played-tracks-model';
import { PlayedTrack } from '../ts';

export class SavePlayedTracksJob {
    private jobId: string;
    private spotifyClient: SpotifyClient;
    private playedTracksModel: PlayedTracksModel;

    constructor(spotifyClient: SpotifyClient, playedTracksModel: PlayedTracksModel, jobId: string = uniqueId()) {
        this.spotifyClient = spotifyClient;
        this.playedTracksModel = playedTracksModel;
        this.jobId = jobId;
    }

    async run(userId: string): Promise<void> {
        const recentlyPlayedTracks: PlayedTrack[] = await this.spotifyClient.getRecentlyPlayedTracks(userId);
        const lastSavedTrack: PlayedTrack = await this.getLastSavedTrack(userId);
        const tracksToBeSaved: PlayedTrack[] = this.filterOutTracksPreviouslySaved(recentlyPlayedTracks, lastSavedTrack);

        await this.playedTracksModel.savePlayedTracks(userId, tracksToBeSaved);
    }

    filterOutTracksPreviouslySaved(recentlyPlayedTracks: PlayedTrack[], lastSavedTrack: PlayedTrack): PlayedTrack[] {
        const tracksToSave: PlayedTrack[] = recentlyPlayedTracks.filter(track => track.playedAt > lastSavedTrack.playedAt);

        return tracksToSave;
    }

    async getLastSavedTrack(userId: string): Promise<PlayedTrack> {
        const lastSavedTrack: PlayedTrack = await this.playedTracksModel.getLastSavedTrack(userId);

        return lastSavedTrack;
    }

    async savePlayedTracks(userId: string, playedTracks: PlayedTrack[]): Promise<void> {

    }
}