import { SpotifyTokenStorage, PlayedTracksStorage, DynamoDBClient } from '../ts';
import { PlayedTracksDynamoDBStorage } from './storage/played-tracks-dynamodb-storage';
import { PlayedTracksModel } from './played-tracks-model';
import { getDynamoDBClient } from '../services';
import { SpotifyTokenDynamoDBStorage } from './storage/spotify-token-dynamodb-storage';
console.log({getDynamoDBClient})
const dynamoDBClient: DynamoDBClient = getDynamoDBClient();

const trackHistoryDynamoDBStorage: PlayedTracksStorage = new PlayedTracksDynamoDBStorage(dynamoDBClient, 'PlayedTracks');
export const playedTracksModel: PlayedTracksModel = new PlayedTracksModel(trackHistoryDynamoDBStorage);
export const spotifyTokenStorage: SpotifyTokenStorage = new SpotifyTokenDynamoDBStorage(dynamoDBClient, 'SpotifyTokens');
