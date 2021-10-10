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

    constructor(spotifyClient: SpotifyClient, trackHistoryModel: TrackHistoryModel) {
        this.jobId = uniqueId();
        this.spotifyClient = spotifyClient;
        this.trackHistoryModel = trackHistoryModel;
    }

    async run() {
        const recentlyPlayedTracks: PlayedTrack[] = await this.spotifyClient.getRecentlyPlayedTracks();
        const lastSavedTrack: PlayedTrack = await this.getLastSavedTrack();

    }

    async getLastSavedTrack(): Promise<PlayedTrack> {
        const lastSavedTrack: PlayedTrack = await this.trackHistoryModel.getLastSavedTrack();

        return lastSavedTrack;
    }
}