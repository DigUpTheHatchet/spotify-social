import { PlayedTrack, PlayedTracksStorage } from '../ts';

export class PlayedTracksModel {
    private playedTracksStorage: PlayedTracksStorage;

    constructor(TrackHistoryStorage: PlayedTracksStorage) {
        this.playedTracksStorage = TrackHistoryStorage;
    }

    async getLastSavedPlayedTrack(userId: string): Promise<PlayedTrack> {
        return this.playedTracksStorage.getLastSavedPlayedTrack(userId);
    }

    async savePlayedTracks(tracks: PlayedTrack[]): Promise<number> {
        await this.playedTracksStorage.savePlayedTracks(tracks);
        return Promise.resolve(tracks.length);
    }

    async getPlayedTracks(userId: string, startDate: Date, endDate: Date): Promise<PlayedTrack[]> {
        return this.playedTracksStorage.getPlayedTracks(userId, startDate, endDate);
    }
}