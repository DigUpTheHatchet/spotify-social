import Bluebird from 'bluebird';
import { expect } from 'chai';

import { savePlayedTracksJob } from '../../../../src/jobs';
import { PlayedTrack, TokenData } from '../../../ts';
import { resetDynamoDBTables } from '../../../../src/utils/dynamoDBTableUtils';
import { playedTracksModel, spotifyModel } from '../../../../src/models';
import { SPOTIFY_REFRESH_TOKEN_ITS } from '../../../../src/config';
import { buildPlayedTrack } from '../../../fixtures';

async function prepareTestTables(tokensData: TokenData[], playedTracks?: PlayedTrack[]): Promise<void> {
    await resetDynamoDBTables();

    if (tokensData) {
        await Bluebird.map(tokensData, (tokenData) => spotifyModel.saveRefreshToken(tokenData));
    }

    if (playedTracks) {
        await playedTracksModel.savePlayedTracks(playedTracks);
    }
}

describe.only('integration/src/jobs/save-played-tracks-job.ts', () => {
    describe('run', () => {
        const userId: string = 'kanye';
        const tokenData: TokenData[] = [{
            userId,
            value: SPOTIFY_REFRESH_TOKEN_ITS!,
            scopes: ['dummy']
        }];

        it('should retrieve and save the user\'s recently played tracks', async () => {
            await prepareTestTables(tokenData);

            const numPlayedTracksSaved: number = await savePlayedTracksJob.run(userId);

            const startDate = new Date('1999-01-01T00:00:00.000Z');
            const endDate = new Date('2099-01-01T00:00:00.000Z');
            const savedPlayedTracks: PlayedTrack[] = await playedTracksModel.getPlayedTracks(userId, startDate, endDate);

            expect(savedPlayedTracks).to.be.an('array').and.to.have.length(50);
            expect(numPlayedTracksSaved).to.eql(50);

            // TODO: Make this functional
            for (const track of savedPlayedTracks) {
                expect(track['spotifyUri']).to.be.a.string;
                expect(track['spotifyId']).to.be.a.string;
                expect(track['trackName']).to.be.a.string;
                expect(track['userId']).to.be.a.string;
                expect(track['playedAt']).to.be.an.instanceOf(Date);
                expect(track['artistNames'].length).to.be.greaterThanOrEqual(1);
            }
        });

        it.only('should retrieve and save the user\'s recently played tracks', async () => {
            const playedTrackInTheFuture: PlayedTrack = buildPlayedTrack({ userId, playedAt: new Date('2099-01-01T00:00:00.000Z')});
            const playedTracks: PlayedTrack[] = [playedTrackInTheFuture];
            await prepareTestTables(tokenData, playedTracks);

            const numPlayedTracksSaved: number = await savePlayedTracksJob.run(userId);

            const startDate = new Date('1999-01-01T00:00:00.000Z');
            const endDate = new Date('2200-01-01T00:00:00.000Z');
            const savedPlayedTracks: PlayedTrack[] = await playedTracksModel.getPlayedTracks(userId, startDate, endDate);

            expect(savedPlayedTracks).to.be.an('array').and.to.have.length(1);
            expect(numPlayedTracksSaved).to.eql(0);
        });
    });
});