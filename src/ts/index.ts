export type PlayedTrack = {
    uri: string;
    id: string;
    name: string;
    playedAt: Date;
    artistNames: string[];
};

export interface TrackHistoryStorage {
    getLastSavedTrack: () => PlayedTrack;
}