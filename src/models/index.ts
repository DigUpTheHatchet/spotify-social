import { SpotifyTokenStorage, PlayedTracksStorage, SpotifyUserStorage } from '../ts';
import { PlayedTracksDynamoDBStorage } from './storage/played-tracks-dynamodb-storage';
import { PlayedTracksModel } from './played-tracks-model';
import { dynamoDBClient, httpClient } from '../services';
import { SpotifyTokenDynamoDBStorage } from './storage/spotify-token-dynamodb-storage';
import { SpotifyModel } from './spotify-model';
import { SpotifyUserDynamoDBStorage } from './storage/spotify-user-dynamodb-storage';

const playedTracksStorage: PlayedTracksStorage = new PlayedTracksDynamoDBStorage(dynamoDBClient, 'PlayedTracks');
export const playedTracksModel: PlayedTracksModel = new PlayedTracksModel(playedTracksStorage);

export const spotifyUserStorage: SpotifyUserStorage = new SpotifyUserDynamoDBStorage(dynamoDBClient, 'SpotifyUsers');
export const spotifyTokenStorage: SpotifyTokenStorage = new SpotifyTokenDynamoDBStorage(dynamoDBClient, 'SpotifyTokens');
export const spotifyModel: SpotifyModel = new SpotifyModel(httpClient, spotifyUserStorage, spotifyTokenStorage);