import { SpotifyTokenStorage, PlayedTracksStorage } from '../ts';
import { PlayedTracksDynamoDBStorage } from './storage/played-tracks-dynamodb-storage';
import { PlayedTracksModel } from './played-tracks-model';
import { dynamoDBClient } from '../services';
import { SpotifyTokenDynamoDBStorage } from './storage/spotify-token-dynamodb-storage';

const trackHistoryDynamoDBStorage: PlayedTracksStorage = new PlayedTracksDynamoDBStorage('PlayedTracks', dynamoDBClient);
export const playedTracksModel: PlayedTracksModel = new PlayedTracksModel(trackHistoryDynamoDBStorage);

export const spotifyTokenStorage: SpotifyTokenStorage = new SpotifyTokenDynamoDBStorage('SpotifyTokens', dynamoDBClient);
