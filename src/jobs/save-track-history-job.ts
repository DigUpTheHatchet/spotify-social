import { uniqueId } from 'lodash';
import SpotifyClient from '../services/spotify-client';
import { TrackHistoryModel } from '../models/track-history-model';

import {
    PlayedTrack,
} from '../ts';

export class SaveTrackHistoryJob {
    private jobId: string;
    private spotifyClient: SpotifyClient;
    private trackHistoryModel: TrackHistoryModel;

    constructor(spotifyClient: SpotifyClient, trackHistoryModel: TrackHistoryModel, jobId: string = uniqueId()) {
        this.spotifyClient = spotifyClient;
        this.trackHistoryModel = trackHistoryModel;
        this.jobId = jobId;
    }

    async run(userId: string) {
        const recentlyPlayedTracks: PlayedTrack[] = await this.spotifyClient.getRecentlyPlayedTracks(userId);
        const lastSavedTrack: PlayedTrack = await this.getLastSavedTrack(userId);
    }

    async getLastSavedTrack(userId: string): Promise<PlayedTrack> {
        const lastSavedTrack: PlayedTrack = await this.trackHistoryModel.getLastSavedTrack(userId);

        return lastSavedTrack;
    }

    async getTrackHistory(userId: string, startDate: Date, endDate: Date): Promise<PlayedTrack[]> {
        const playedTracks: PlayedTrack[] = await this.trackHistoryModel.getPlayedTracks(userId, startDate, endDate);

        return playedTracks;
    }
}