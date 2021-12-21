import { expect } from 'chai';
import { playedTracksModel } from '../../../../src/models';
import { buildPlayedTrack } from '../../../fixtures';
import { PlayedTrack } from '../../../ts';
import { resetDynamoDBTables } from '../../../../src/utils/dynamoDBTableUtils';

async function prepareDynamoDBTable(playedTracks: PlayedTrack[]): Promise<void> {
    await resetDynamoDBTables();

    if (playedTracks) {
        await playedTracksModel.savePlayedTracks(playedTracks);
    }
}

describe('integration/src/models/played-tracks-model.ts', () => {
    describe('getLastSavedPlayedTrack', () => {
        const userId = 'spidey100';
        const playedTracks: PlayedTrack[] = [
            buildPlayedTrack({ userId, playedAt: new Date('2021-12-20T01:00:00.000Z') }),
            buildPlayedTrack({ userId, playedAt: new Date('2021-12-31T07:00:00.000Z') }),
            buildPlayedTrack({ userId: 'someOtherUser', playedAt: new Date('2022-01-01T01:00:00.000Z')}),
            buildPlayedTrack({ userId, playedAt: new Date('2021-12-20T23:00:00.000Z') })
        ];

        beforeEach(async () => {
            await prepareDynamoDBTable(playedTracks);
        });

        it('should retrieve the user\'s most recently played track from the database', async () => {
            const expectedLastSavedPlayedTrack: PlayedTrack = playedTracks[1];
            const retrievedTrack: PlayedTrack = await playedTracksModel.getLastSavedPlayedTrack(userId);

            expect(retrievedTrack).to.eql(expectedLastSavedPlayedTrack);
        });
    });

    describe('savePlayedTracks', () => {
        const userId = 'frank';
        const playedTracks: PlayedTrack[] = [
            buildPlayedTrack({ userId, playedAt: new Date('2021-11-20T01:00:00.000Z') }),
            buildPlayedTrack({ userId: 'someOtherUser', playedAt: new Date('2022-01-01T01:00:00.000Z')}),
            buildPlayedTrack({ userId, playedAt: new Date('2021-03-11T23:00:00.000Z') })
        ];

        beforeEach(async () => {
            await prepareDynamoDBTable([]);
        });

        it('should save the user\'s played tacks in the database', async () => {
            const expectedPlayedTracks: PlayedTrack[] = [playedTracks[2], playedTracks[0]];
            await playedTracksModel.savePlayedTracks(playedTracks);

            const startDate = new Date('1999-01-01T00:00:00.000Z');
            const endDate = new Date('2099-01-01T00:00:00.000Z');
            const retrievedTracks: PlayedTrack[] = await playedTracksModel.getPlayedTracks(userId, startDate, endDate);

            expect(retrievedTracks).to.eql(expectedPlayedTracks);
        });
    });

    describe('getPlayedTracks', () => {
        const userId = 'berlinYo';
        const playedTracks: PlayedTrack[] = [
            buildPlayedTrack({ userId, playedAt: new Date('2021-11-20T01:00:00.000Z') }),
            buildPlayedTrack({ userId: 'someOtherUser', playedAt: new Date('2022-01-01T01:00:00.000Z')}),
            buildPlayedTrack({ userId, playedAt: new Date('2021-03-11T23:00:00.000Z') })
        ];

        beforeEach(async () => {
            await prepareDynamoDBTable(playedTracks);
        });

        it('should retrieve the user\'s played tracks for the time period specified', async () => {
            const expectedPlayedTracks: PlayedTrack[] = [playedTracks[2], playedTracks[0]];

            const startDate = new Date('1999-01-01T00:00:00.000Z');
            const endDate = new Date('2099-01-01T00:00:00.000Z');
            const retrievedTracks: PlayedTrack[] = await playedTracksModel.getPlayedTracks(userId, startDate, endDate);

            expect(retrievedTracks).to.eql(expectedPlayedTracks);
        });
    });
});