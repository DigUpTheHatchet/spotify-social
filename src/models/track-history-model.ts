import { PlayedTrack, TrackHistoryStorage } from '../ts';

export class TrackHistoryModel {
    private trackHistoryStorage: TrackHistoryStorage;

    constructor(TrackHistoryStorage: TrackHistoryStorage) {
        this.trackHistoryStorage = TrackHistoryStorage;
    }

    async getLastSavedTrack(): Promise<PlayedTrack> {
        return this.trackHistoryStorage.getLastSavedTrack();
    }

    async savePlayedTracks(tracks: PlayedTrack[]): Promise<any> {

    }

    // async getTrackHistory()
}