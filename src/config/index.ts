export const NODE_ENV = process.env['NODE_ENV'] || 'local-dev';

export const SPOTIFY_CLIENT_ID = process.env['SPOTIFY_CLIENT_ID'];
export const SPOTIFY_CLIENT_SECRET = process.env['SPOTIFY_CLIENT_SECRET'];
export const SPOTIFY_REFRESH_TOKEN_ITS = process.env['SPOTIFY_REFRESH_TOKEN_ITS'];

export const AWS_SECRET_ACCESS_KEY = process.env['AWS_SECRET_ACCESS_KEY'] || 'local';
export const AWS_ACCESS_KEY_ID = process.env['AWS_ACCESS_KEY_ID'] || 'local';
export const AWS_REGION = process.env['REGION'] || 'ap-southeast-2';

export const DYNAMODB_ENDPOINT = NODE_ENV === 'prod' ? `https://dynamodb.${AWS_REGION}.amazonaws.com` : 'http://localhost:8000';
console.log({DYNAMODB_ENDPOINT});
