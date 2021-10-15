import { SpotifyTokenStorage, TrackHistoryStorage } from '../ts';
import { TrackHistoryDynamoDBStorage } from './storage/track-history-dynamodb-storage';
import { TrackHistoryModel } from './track-history-model';
import { dynamoDBClient } from '../services';
import { SpotifyTokenDynamoDBStorage } from './storage/spotify-token-dynamodb-storage';

const trackHistoryDynamoDBStorage: TrackHistoryStorage = new TrackHistoryDynamoDBStorage('TestTable', dynamoDBClient);
export const trackHistoryModel: TrackHistoryModel = new TrackHistoryModel(trackHistoryDynamoDBStorage);

export const spotifyTokenStorage: SpotifyTokenStorage = new SpotifyTokenDynamoDBStorage('TestTable', dynamoDBClient);
