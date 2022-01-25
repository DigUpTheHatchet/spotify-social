import { expect } from 'chai';
import { stubInterface } from 'ts-sinon';

import { DynamoDBClient, SpotifyToken } from '../../../../ts';
import { SpotifyTokenDynamoDBStorage } from '../../../../../src/models/storage/spotify-token-dynamodb-storage';
import { buildSpotifyToken } from '../../../../fixtures';


const mockTableName = 'dummy-table';
const mockDynamoDBClient = stubInterface<DynamoDBClient>();
const spotifyTokenDynamoDBStorage = new SpotifyTokenDynamoDBStorage(mockDynamoDBClient, mockTableName);

describe('unit/src/models/storage/spotify-token-dynamodb-storage.ts', () => {
    describe('getRefreshToken', () => {
        const userId = 'rickJameson';

        const mockGetItemReturn = {
            type: 'refresh',
            value: 'blaldasdnlasdasdasndlnaslkdnaskdlnaslkdnas',
            userId,
            scopes: ['user-do-something', 'user-do-something-else'],
            createdAt: new Date()
        };

        beforeEach(() => {
            mockDynamoDBClient.getItem.resolves(mockGetItemReturn);
        });

        afterEach(() => {
            mockDynamoDBClient.getItem.reset();
        });

        it('should use the ddb client to retrieve the user\'s refresh token', async () => {
            const expectedRefreshToken: SpotifyToken = buildSpotifyToken({ userId, value: mockGetItemReturn.value, createdAt: new Date(mockGetItemReturn.createdAt) });
            const expectedGetItemParams = {
                TableName: mockTableName,
                Key: { 'userId': { 'S' : userId }, 'type': { 'S' : 'refresh' } }
            };
            const expectedDateFields = ['createdAt'];

            const refreshToken: SpotifyToken = await spotifyTokenDynamoDBStorage.getRefreshToken(userId);

            expect(refreshToken).to.eql(expectedRefreshToken);
            expect(mockDynamoDBClient.getItem).to.have.been.calledOnceWithExactly(expectedGetItemParams, expectedDateFields);
        });
    });

    describe('saveToken', () => {
        const userId = 'franklindresevoir';
        const mockToken: SpotifyToken = buildSpotifyToken({ userId });

        it('should use the ddb client to save the spotify token', async () => {
            const expectedDateFields = ['createdAt'];

            await spotifyTokenDynamoDBStorage.saveToken(mockToken);

            expect(mockDynamoDBClient.putItem).to.have.been.calledOnceWithExactly(mockTableName, mockToken, expectedDateFields);
        });
    });
});