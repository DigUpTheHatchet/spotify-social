import { SpotifyTokenStorage, PlayedTracksStorage } from '../ts';
import { PlayedTracksDynamoDBStorage } from './storage/played-tracks-dynamodb-storage2';
import { PlayedTracksModel } from './played-tracks-model';
import { dynamoDBClient, httpClient } from '../services';
import { SpotifyTokenDynamoDBStorage } from './storage/spotify-token-dynamodb-storage';
import { SpotifyModel } from './spotify-model';

const trackHistoryDynamoDBStorage: PlayedTracksStorage = new PlayedTracksDynamoDBStorage(dynamoDBClient, 'PlayedTracks');
export const playedTracksModel: PlayedTracksModel = new PlayedTracksModel(trackHistoryDynamoDBStorage);

export const spotifyTokenStorage: SpotifyTokenStorage = new SpotifyTokenDynamoDBStorage(dynamoDBClient, 'SpotifyTokens');
export const spotifyModel: SpotifyModel = new SpotifyModel(httpClient, spotifyTokenStorage);