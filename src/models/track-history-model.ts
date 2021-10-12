import { PlayedTrack, TrackHistoryStorage } from '../ts';

export class TrackHistoryModel {
    private trackHistoryStorage: TrackHistoryStorage;

    constructor(TrackHistoryStorage: TrackHistoryStorage) {
        this.trackHistoryStorage = TrackHistoryStorage;
    }

    async getLastSavedTrack(userId: string): Promise<PlayedTrack> {
        return this.trackHistoryStorage.getLastSavedTrack(userId);
    }

    async savePlayedTracks(userId: string, tracks: PlayedTrack[]): Promise<any> {
        return this.trackHistoryStorage.savePlayedTracks(userId, tracks);
    }

    async getPlayedTracks(userId: string, startDate: Date, endDate: Date): Promise<PlayedTrack[]> {
        return this.trackHistoryStorage.getPlayedTracks(userId, startDate, endDate);
    }
}