import Bluebird from 'bluebird';
import { expect } from 'chai';

import { savePlayedTracksJob } from '../../../../src/jobs';
import { PlayedTrack, SpotifyUserData } from '../../../ts';
import { resetDynamoDBTables } from '../../../../src/utils/dynamoDBTableUtils';
import { playedTracksModel, spotifyModel } from '../../../../src/models';
import { SPOTIFY_REFRESH_TOKEN_ITS } from '../../../../src/config';
import { buildPlayedTrack, buildSpotifyUserData } from '../../../fixtures';

async function prepareTestTables(usersData: SpotifyUserData[], playedTracks?: PlayedTrack[]): Promise<void> {
    await resetDynamoDBTables();

    if (usersData) {
        await Bluebird.each(usersData, (userData) => spotifyModel.registerUser(userData));
    }

    if (playedTracks) {
        await playedTracksModel.savePlayedTracks(playedTracks);
    }
}

describe('integration/src/jobs/save-played-tracks-job.ts', () => {
    describe('run', () => {
        const userId = 'mick_jenkins';

        const usersData: SpotifyUserData[] = [buildSpotifyUserData({
            userId,
            refreshToken: SPOTIFY_REFRESH_TOKEN_ITS!
        })];

        beforeEach(async () => {
            await prepareTestTables(usersData);
        });

        it('should call runForUser for each (enabled) user in the database', async () => {
            await savePlayedTracksJob.run();

            const startDate = new Date('1999-01-01T00:00:00.000Z');
            const endDate = new Date('2099-01-01T00:00:00.000Z');
            const savedPlayedTracks: PlayedTrack[] = await playedTracksModel.getPlayedTracks(userId, startDate, endDate);

            expect(savedPlayedTracks).to.be.an('array').and.to.have.length.greaterThan(5);

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
    });

    describe('runForUser', () => {
        const userId: string = 'kanye';
        const userData: SpotifyUserData[] = [buildSpotifyUserData({
            userId,
            refreshToken: SPOTIFY_REFRESH_TOKEN_ITS!
        })];

        it('should retrieve and save the user\'s recently played tracks', async () => {
            await prepareTestTables(userData);

            await savePlayedTracksJob.runForUser(userId);

            const startDate = new Date('1999-01-01T00:00:00.000Z');
            const endDate = new Date('2099-01-01T00:00:00.000Z');
            const savedPlayedTracks: PlayedTrack[] = await playedTracksModel.getPlayedTracks(userId, startDate, endDate);

            expect(savedPlayedTracks).to.be.an('array').and.to.have.length.greaterThan(5);

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

        it('should retrieve and save the user\'s recently played tracks', async () => {
            const playedTrackInTheFuture: PlayedTrack = buildPlayedTrack({ userId, playedAt: new Date('2099-01-01T00:00:00.000Z')});
            const playedTracks: PlayedTrack[] = [playedTrackInTheFuture];
            await prepareTestTables(userData, playedTracks);

            await savePlayedTracksJob.runForUser(userId);

            const startDate = new Date('1999-01-01T00:00:00.000Z');
            const endDate = new Date('2200-01-01T00:00:00.000Z');
            const savedPlayedTracks: PlayedTrack[] = await playedTracksModel.getPlayedTracks(userId, startDate, endDate);

            expect(savedPlayedTracks).to.be.an('array').and.to.have.length(1);
            expect(savedPlayedTracks).to.eql(playedTracks);
        });
    });
});