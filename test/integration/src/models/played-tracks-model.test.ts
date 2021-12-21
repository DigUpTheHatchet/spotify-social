import { expect } from 'chai';
import { playedTracksModel } from '../../../../src/models';
import { buildPlayedTrack } from '../../../fixtures';
import { PlayedTrack } from '../../../ts';
import { resetDynamoDBTables } from '../../../../src/utils/dynamoDBTableUtils';


async function prepareDynamoDBTable(userId: string, playedTracks: PlayedTrack[]): Promise<void> {
    await resetDynamoDBTables();
    await playedTracksModel.savePlayedTracks(playedTracks);
}

describe('integration/src/models/played-tracks-model.ts', () => {
    describe.only('getLastSavedTrack', () => {
        const userId = 'spidey100';
        const playedTracks: PlayedTrack[] = [ buildPlayedTrack({ userId }) ];

        beforeEach(async () => {
            await prepareDynamoDBTable(userId, playedTracks);
        });

        it('should retrieve the user\'s last saved track from the database', async () => {
            const expectedLastSavedTrack: PlayedTrack = playedTracks[0];
            const lastSavedTrack: PlayedTrack = await playedTracksModel.getLastSavedTrack(userId);

            console.log({expectedLastSavedTrack});
            console.log({lastSavedTrack});
            expect(lastSavedTrack).to.eql(expectedLastSavedTrack);
        });
    });

    describe('savePlayedTracks', () => {
        it('todo', async () => {
            // const userId: string = 'xdrk';

            // const playedTracks: PlayedTrack[] = [{
            //     spotifyUri: 'spotify:track:091n9MH1VUepOdhnv7SLci',
            //     spotifyId: '091n9MH1VUepOdhnv7SLci',
            //     artistNames: ['Denzel Curry'],
            //     playedAt: new Date('2021-08-16T07:04:05.701Z'),
            //     trackName: 'The Game',
            //     userId
            // }];

            // await playedTracksModel.savePlayedTracks(userId, playedTracks);
        });
    });
});