import { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import sinon from 'sinon';

import { DynamoDBClient, PlayedTrack } from '../../../../ts';
import { PlayedTracksDynamoDBStorage } from '../../../../../src/models/storage/played-tracks-dynamodb-storage';
import { buildPlayedTrack } from '../../../../fixtures';

const mockTableName = 'PlayedTracks';
const mockDynamoDBClient = stubInterface<DynamoDBClient>();
const playedTracksDynamoDBStorage: PlayedTracksDynamoDBStorage = new PlayedTracksDynamoDBStorage(mockDynamoDBClient, mockTableName);

describe('unit/src/models/storage/played-tracks-dynamodb-storage.ts', () => {
    const userId = 'brian123';

    describe('getLastSavedPlayedTrack', async () => {
        const mockQueryReturn = [{
            userId,
            spotifyUri: 'spotify:track:091n9MH1VUepOdhnv7SLci',
            spotifyId: '091n9MH1VUepOdhnv7SLci',
            trackName: 'Who dunnit?',
            playedAt: Date.now(),
            artistNames: ['Scooby Doo', 'Shaggy'],
        }];

        beforeEach(() => {
            mockDynamoDBClient.query.resolves(mockQueryReturn);
        });

        afterEach(() => {
            mockDynamoDBClient.query.reset();
        });

        it('should construct & execute the DynamoDB query for the user\'s last saved track', async () => {
            const expectedQueryParams = {
                TableName: mockTableName,
                ScanIndexForward: false,
                Limit: 1,
                KeyConditionExpression: 'userId = :v_pk',
                ExpressionAttributeValues: {
                    ':v_pk': { 'S': userId }
                },
            };

            const expectedTrack: PlayedTrack = buildPlayedTrack({ userId, playedAt: new Date(mockQueryReturn[0].playedAt) });

            const retrievedTrack: PlayedTrack = await playedTracksDynamoDBStorage.getLastSavedPlayedTrack(userId);

            expect(retrievedTrack).to.eql(expectedTrack);
            expect(mockDynamoDBClient.query).to.have.been.calledOnceWithExactly(expectedQueryParams);
        });
    });

    describe('savePlayedTracks', () => {
        const playedTracks: PlayedTrack[] = [
            buildPlayedTrack({ userId: 'neverlucky' }),
            buildPlayedTrack({ userId: 'billclinton' })
        ];

        beforeEach(() => {
            mockDynamoDBClient.batchWriteItems.resolves();
        });

        afterEach(() => {
            mockDynamoDBClient.batchWriteItems.reset();
        });

        it('should use the ddb client to save the played tracks in the database', async () => {
            const expectedItems = [
                Object.assign({}, playedTracks[0], { playedAt: playedTracks[0].playedAt.valueOf() }),
                Object.assign({}, playedTracks[1], { playedAt: playedTracks[1].playedAt.valueOf() })
            ];

            await playedTracksDynamoDBStorage.savePlayedTracks(playedTracks);

            expect(mockDynamoDBClient.batchWriteItems).to.have.been.calledOnceWithExactly(mockTableName, expectedItems);
        });
    });

    describe('getPlayedTracks', () => {
        const userId = 'dearie';
        const startDate = new Date('2022-01-01T09:04:41.607Z');
        const endDate = new Date('2022-01-03T09:04:41.607Z');

        const mockQueryReturn = [{
            userId,
            spotifyUri: 'spotify:track:091n9MH1VUepOdhnv7SLci',
            spotifyId: '091n9MH1VUepOdhnv7SLci',
            trackName: 'Who dunnit?',
            playedAt: new Date('2022-01-02T10:09:00.907Z'),
            artistNames: ['Scooby Doo', 'Shaggy'],
        }, {
            userId,
            spotifyUri: 'spotify:track:091n9MH1VUepOdhnv7SLci',
            spotifyId: '091n9MH1VUepOdhnv7SLci',
            trackName: 'Who dunnit?',
            playedAt: new Date('2022-01-02T10:15:00.237Z'),
            artistNames: ['Scooby Doo', 'Shaggy'],
        }];

        beforeEach(() => {
            mockDynamoDBClient.query.resolves(mockQueryReturn);
        });

        afterEach(() => {
            mockDynamoDBClient.query.reset();
        });

        it('should use the ddb client to save the played tracks in the database', async () => {
            const expectedQueryParams = {
                TableName: mockTableName,
                ScanIndexForward: true,
                KeyConditionExpression: 'userId = :v_pk AND playedAt BETWEEN :v_from AND :v_to',
                ExpressionAttributeValues: {
                    ':v_pk': { 'S': userId },
                    ':v_from': { 'N': startDate.valueOf().toString() },
                    ':v_to': { 'N': endDate.valueOf().toString() },
                },
            };

            const expectedPlayedTracks: PlayedTrack[] = [
                buildPlayedTrack({ userId, playedAt: new Date(mockQueryReturn[0].playedAt) }),
                buildPlayedTrack({ userId, playedAt: new Date(mockQueryReturn[1].playedAt) })
            ];

            const playedTracks: PlayedTrack[] = await playedTracksDynamoDBStorage.getPlayedTracks(userId, startDate, endDate);

            expect(playedTracks).to.eql(expectedPlayedTracks);
            expect(mockDynamoDBClient.query).to.have.been.calledOnceWithExactly(expectedQueryParams);
        });
    });
});