import { TrackHistoryStorage } from '../ts';
import { TrackHistoryDynamoDBStorage } from './storage/track-history-dynamodb-storage';
import { TrackHistoryModel } from './track-history-model';
import { dynamoDBClient } from '../services';

export const trackHistoryDynamoDBStorage: TrackHistoryStorage = new TrackHistoryDynamoDBStorage('TestTable', dynamoDBClient);
export const trackHistoryModel = new TrackHistoryModel(trackHistoryDynamoDBStorage);