import { uniqueId } from 'lodash';
import SpotifyClient from '../services/spotify-client';
import { PlayedTracksModel } from '../models/played-tracks-model';

import {
    PlayedTrack,
} from '../ts';

export class SavePlayedTracksJob {
    private jobId: string;
    private spotifyClient: SpotifyClient;
    private playedTracksModel: PlayedTracksModel;

    constructor(spotifyClient: SpotifyClient, playedTracksModel: PlayedTracksModel, jobId: string = uniqueId()) {
        this.spotifyClient = spotifyClient;
        this.playedTracksModel = playedTracksModel;
        this.jobId = jobId;
    }

    async run(userId: string) {
        const recentlyPlayedTracks: PlayedTrack[] = await this.spotifyClient.getRecentlyPlayedTracks(userId);
        const lastSavedTrack: PlayedTrack = await this.getLastSavedTrack(userId);
    }

    async getLastSavedTrack(userId: string): Promise<PlayedTrack> {
        const lastSavedTrack: PlayedTrack = await this.playedTracksModel.getLastSavedTrack(userId);

        return lastSavedTrack;
    }

    async getTrackHistory(userId: string, startDate: Date, endDate: Date): Promise<PlayedTrack[]> {
        const playedTracks: PlayedTrack[] = await this.playedTracksModel.getPlayedTracks(userId, startDate, endDate);

        return playedTracks;
    }
}