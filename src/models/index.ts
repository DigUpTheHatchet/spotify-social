import { TrackHistoryDynamoDBStorage } from './storage/track-history-dynamodb-storage';
import { TrackHistoryModel } from './track-history-model';

export const trackHistoryDynamoDBStorage = new TrackHistoryDynamoDBStorage();
export const trackHistoryModel = new TrackHistoryModel(trackHistoryDynamoDBStorage);