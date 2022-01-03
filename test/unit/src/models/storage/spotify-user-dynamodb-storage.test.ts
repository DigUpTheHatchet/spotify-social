import { expect } from 'chai';
import { stubInterface } from 'ts-sinon';

import { DynamoDBClient, SpotifyUser } from '../../../../ts';
import { SpotifyUserDynamoDBStorage } from '../../../../../src/models/storage/spotify-user-dynamodb-storage';
import { buildSpotifyUser } from '../../../../fixtures';

const mockTableName = 'dummy-table';
const mockDynamoDBClient = stubInterface<DynamoDBClient>();
const spotifyUserDynamoDBStorage = new SpotifyUserDynamoDBStorage(mockDynamoDBClient, mockTableName);

describe('unit/src/models/storage/spotify-user-dynamodb-storage.ts', () => {
    describe('saveUser', () => {
        const userId = 'fruitfly';
        const mockUser: SpotifyUser = buildSpotifyUser({ userId });

        beforeEach(() => {
            mockDynamoDBClient.putItem.resolves();
        });

        afterEach(() => {
            mockDynamoDBClient.putItem.reset();
        });

        it('should use the ddb client to save the spotify user', async () => {
            const expectedItem = { ... mockUser, registeredAt: mockUser.registeredAt.valueOf() };

            await spotifyUserDynamoDBStorage.saveUser(mockUser);

            expect(mockDynamoDBClient.putItem).to.have.been.calledOnceWithExactly(mockTableName, expectedItem);
        });
    });

    describe('getAllUsers', () => {
        const mockScanResult = [{
            userId: 'purple',
            email: 'purple@hotmail.com',
            name: 'namesless1',
            registeredAt: Date.now(),
            isEnabled: true
        }, {
            userId: 'pink',
            email: 'pink@hotmail.com',
            name: 'nameless2',
            registeredAt: Date.now(),
            isEnabled: true
        }];

        beforeEach(() => {
            mockDynamoDBClient.scan.resolves(mockScanResult);
        });

        afterEach(() => {
            mockDynamoDBClient.scan.reset();
        });

        it('should use the ddb client to get all of the spotify users from the database', async () => {
            const expectedScanParams = { TableName: mockTableName };
            const expectedUsers: SpotifyUser[] = [
                buildSpotifyUser({
                    userId: mockScanResult[0].userId,
                    email: mockScanResult[0].email,
                    name: mockScanResult[0].name,
                    registeredAt: new Date(mockScanResult[0].registeredAt)
                }), buildSpotifyUser({
                    userId: mockScanResult[1].userId,
                    email: mockScanResult[1].email,
                    name: mockScanResult[1].name,
                    registeredAt: new Date(mockScanResult[1].registeredAt)
                })
            ];

            const users: SpotifyUser[] = await spotifyUserDynamoDBStorage.getAllUsers();

            expect(users).to.eql(expectedUsers);
            expect(mockDynamoDBClient.scan).to.have.been.calledOnceWithExactly(expectedScanParams);
        });
    });

    describe('getUser', () => {
        const userId = 'moneyinthebananastand';

        const mockGetItemReturn = {
            userId,
            email: 'garry@skysports.com',
            name: 'Garry Neville',
            registeredAt: Date.now(),
            isEnabled: true
        };

        beforeEach(() => {
            mockDynamoDBClient.getItem.resolves(mockGetItemReturn);
        });

        afterEach(() => {
            mockDynamoDBClient.getItem.reset();
        });

        it('should use the ddb client to retrieve the user', async () => {
            const expectedUser: SpotifyUser = buildSpotifyUser({
                userId,
                name: mockGetItemReturn.name,
                email: mockGetItemReturn.email,
                registeredAt: new Date(mockGetItemReturn.registeredAt)
            });

            const expectedGetItemParams = {
                TableName: mockTableName,
                Key: { 'userId': { 'S' : userId } }
            };

            const user: SpotifyUser = await spotifyUserDynamoDBStorage.getUser(userId);

            expect(user).to.eql(expectedUser);
            expect(mockDynamoDBClient.getItem).to.have.been.calledOnceWithExactly(expectedGetItemParams);
        });
    });
});