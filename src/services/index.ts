import SpotifyClient from './spotify-client';
import { HttpClient } from './http-client';
import { DynamoDBClient } from './dynamodb-client';

const httpClient = new HttpClient();
export const spotifyClient: SpotifyClient = new SpotifyClient(httpClient);
export const dynamoDBClient = new DynamoDBClient();