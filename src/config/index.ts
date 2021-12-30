import { DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';

const nodeEnv: string = process.env['NODE_ENV'] || 'local-dev';
const isProdEnv: boolean = nodeEnv === 'prod';

export const SPOTIFY_CLIENT_ID = process.env['SPOTIFY_CLIENT_ID'];
export const SPOTIFY_CLIENT_SECRET = process.env['SPOTIFY_CLIENT_SECRET'];
export const SPOTIFY_REFRESH_TOKEN_ITS = process.env['SPOTIFY_REFRESH_TOKEN_ITS'];
export const SPOTIFY_REFRESH_TOKEN_SCOPES_ITS = process.env['SPOTIFY_REFRESH_TOKEN_SCOPES_ITS'];

const AWS_SECRET_ACCESS_KEY: string = process.env['AWS_SECRET_ACCESS_KEY'] || 'local';
const AWS_ACCESS_KEY_ID: string = process.env['AWS_ACCESS_KEY_ID'] || 'local';
const AWS_REGION: string = process.env['REGION'] || 'ap-southeast-2';

export const dynamoDBConfig: DynamoDBClientConfig = buildDynamoDBClientConfig();

function buildDynamoDBClientConfig(): DynamoDBClientConfig {
    return {
        region: AWS_REGION,
        endpoint: isProdEnv ? `https://dynamodb.${AWS_REGION}.amazonaws.com` : 'http://localhost:8000',
        ...(!isProdEnv) && { credentials: { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY }}
    };
}