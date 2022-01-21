import {
    AttributeValue,
    CreateTableInput,
    GetItemInput,
    QueryInput,
    ScanInput
} from '@aws-sdk/client-dynamodb';

export type PlayedTrack = {
    spotifyUri: string;
    spotifyId: string;
    trackName: string;
    playedAt: Date;
    userId: string;
    artistNames: string[];
};

export interface SpotifyToken {
    type: string;
    value: string;
    userId: string;
    scopes: string[];
    createdAt: Date;
}

export interface SpotifyUser {
    userId: string;
    email: string;
    name: string;
    registeredAt: Date;
    isEnabled: boolean;
}

export interface SpotifyUserData {
    userId: string;
    email: string;
    name: string;
    refreshToken: string;
    scopes: string[];
    registeredAt: Date;
}

export type DynamoItem = {
    [key: string]: AttributeValue;
} | undefined;

export interface DynamoDBClient {
    // TODO: I'd rather expose less DDB internals (e.g. types) on this interface
    // getItem should be: `(tableName: string, key: Key) => Promise<any>`;
    // instead of the caller needing to know the `params: GetItemInput` detail

    getItem: (params: GetItemInput) => Promise<any>;
    scan: (params: ScanInput) => Promise<any>;
    query: (params: QueryInput) => Promise<any>;

    putItem: (tableName: string, item: any) => Promise<any>;
    batchWriteItems: (tableName: string, items: any[]) => Promise<any>;

    createTable: (params: CreateTableInput) => Promise<any>;
    deleteTable: (tableName: string) => Promise<any>;
}

export interface PlayedTracksStorage {
    getLastSavedPlayedTrack: (userId: string) => Promise<PlayedTrack>;
    savePlayedTracks: (tracks: PlayedTrack[]) => Promise<void>;
    getPlayedTracks: (userId: string, startDate: Date, endDate: Date) => Promise<PlayedTrack[]>;
}

export interface SpotifyTokenStorage {
    getRefreshToken: (userId: string) => Promise<SpotifyToken>;
    saveToken: (token: SpotifyToken) => Promise<void>;
}

export interface SpotifyUserStorage {
    saveUser: (user: SpotifyUser) => Promise<void>;
    getUser: (userId: string) => Promise<SpotifyUser>;
    getAllUsers: () => Promise<SpotifyUser[]>;
}