import { GetItemInput } from '@aws-sdk/client-dynamodb';
import { DynamoDBClient, SpotifyToken, SpotifyTokenStorage } from '../../ts';

export class SpotifyTokenDynamoDBStorage implements SpotifyTokenStorage {
    private dynamoDBClient: DynamoDBClient;
    private tableName: string;

    constructor(tableName: string, dynamoDBClient: DynamoDBClient) {
        this.tableName = tableName;
        this.dynamoDBClient = dynamoDBClient;
    }

    async getRefreshToken(userId: string): Promise<SpotifyToken> {
        const params: GetItemInput = {
            TableName: this.tableName,
            Key: {
                'userId': { 'S' : userId }, // Partition Key 
                'tokenType': { 'S' : 'refresh:track-history' } // Range Key
            }
        };

        return this.dynamoDBClient.getItem(params);
    }

    async saveToken(userId: string, token: SpotifyToken): Promise<any> {


        return this.dynamoDBClient.putItem(params);
    }


    // const getItemParams: GetItemInput = {
    //     TableName: tableName,
    //     Key: { 'testKey': { 'S' : key.value } }
    // };

    // const queryParams: QueryInput = {
    //     TableName: tableName,
    //     ExpressionAttributeValues: {
    //         ":v1": {
    //           S: "abc"
    //          }
    //        }, 
    //     KeyConditionExpression: "userId = :v1", 
    // };
}