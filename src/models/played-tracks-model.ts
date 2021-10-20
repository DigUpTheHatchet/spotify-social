import { PlayedTrack, PlayedTracksStorage } from '../ts';

export class PlayedTracksModel {
    private playedTracksStorage: PlayedTracksStorage;

    constructor(TrackHistoryStorage: PlayedTracksStorage) {
        this.playedTracksStorage = TrackHistoryStorage;
    }

    async getLastSavedTrack(userId: string): Promise<PlayedTrack> {
        return this.playedTracksStorage.getLastSavedTrack(userId);
    }

    async savePlayedTracks(userId: string, tracks: PlayedTrack[]): Promise<any> {
        return this.playedTracksStorage.savePlayedTracks(userId, tracks);
    }

    async getPlayedTracks(userId: string, startDate: Date, endDate: Date): Promise<PlayedTrack[]> {
        return this.playedTracksStorage.getPlayedTracks(userId, startDate, endDate);
    }
}