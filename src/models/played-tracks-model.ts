import { PlayedTrack, PlayedTracksStorage } from '../ts';

export class PlayedTracksModel {
    private playedTracksStorage: PlayedTracksStorage;

    constructor(TrackHistoryStorage: PlayedTracksStorage) {
        this.playedTracksStorage = TrackHistoryStorage;
    }

    async getLastSavedTrack(userId: string): Promise<PlayedTrack> {
        return this.playedTracksStorage.getLastSavedTrack(userId);
    }

    async savePlayedTracks(tracks: PlayedTrack[]): Promise<any> {
        return this.playedTracksStorage.savePlayedTracks(tracks);
    }

    async getPlayedTracks(userId: string, startDate: Date, endDate: Date): Promise<PlayedTrack[]> {
        return this.playedTracksStorage.getPlayedTracks(userId, startDate, endDate);
    }
}