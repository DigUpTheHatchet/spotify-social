import { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import sinon from 'sinon';

import { SavePlayedTracksJob } from '../../../../src/jobs/save-played-tracks-job';
import { PlayedTrack, SpotifyUser } from '../../../ts';
import { buildPlayedTrack, buildSpotifyUser } from '../../../fixtures';
import { PlayedTracksModel } from '../../../models/played-tracks-model';
import { SpotifyModel } from '../../../../src/models/spotify-model';

const mockSpotifyModel = stubInterface<SpotifyModel>();
const mockPlayedTracksModel = stubInterface<PlayedTracksModel>();
const savePlayedTracksJob = new SavePlayedTracksJob(mockSpotifyModel, mockPlayedTracksModel);

describe('unit/src/jobs/save-played-tracks-job.ts', () => {
    describe('run', () => {
        const enabledUsers: SpotifyUser[] = [
            buildSpotifyUser({ userId: 'harry3' }),
            buildSpotifyUser({ userId: 'brian90' }),
            buildSpotifyUser({ userId: 'felix_fell_off' })
        ];

        beforeEach(() => {
            mockSpotifyModel.getEnabledUsers.resolves(enabledUsers);
            sinon.stub(savePlayedTracksJob, 'runForUser').resolves();
        });

        afterEach(() => {
            mockSpotifyModel.getEnabledUsers.reset();
            (savePlayedTracksJob.runForUser as sinon.SinonStub).restore();
        });

        it('should call runForUser once for each enabled user', async () => {
            const expectedUserIds: string[] = enabledUsers.map(u => u.userId);

            await savePlayedTracksJob.run();

            expect(savePlayedTracksJob.runForUser).to.have.calledThrice();
            expect((savePlayedTracksJob.runForUser as sinon.SinonStub).getCalls().map(spyCall => spyCall.args[0])).to.eql(expectedUserIds);
        });
    });

    describe('runForUser', () => {
        const userId = 'ryangosling';
        const lastSavedPlayedTrack: PlayedTrack = buildPlayedTrack({ playedAt: new Date('2021-01-01T01:00:00.000Z') });
        const recentlyPlayedTracks: PlayedTrack[] = [
            buildPlayedTrack({ userId, playedAt: new Date('2021-01-02T00:00:00.000Z') }),
            buildPlayedTrack({ userId, playedAt: new Date('2021-01-02T01:00:00.000Z') })
        ];

        beforeEach(() => {
            mockSpotifyModel.getRecentlyPlayedTracks.resolves(recentlyPlayedTracks);
            sinon.stub(savePlayedTracksJob, 'getLastSavedPlayedTrack').resolves(lastSavedPlayedTrack);
            sinon.stub(savePlayedTracksJob, 'filterOutTracksPreviouslySaved').returns(recentlyPlayedTracks);
            mockPlayedTracksModel.savePlayedTracks.resolves();
        });

        afterEach(() => {
            mockSpotifyModel.getRecentlyPlayedTracks.reset();
            (savePlayedTracksJob.getLastSavedPlayedTrack as sinon.SinonStub).restore();
            (savePlayedTracksJob.filterOutTracksPreviouslySaved as sinon.SinonStub).restore();
            mockPlayedTracksModel.savePlayedTracks.reset();
        });

        it('should get & save the user\'s recently played tracks', async () => {
            await savePlayedTracksJob.runForUser(userId);

            expect(mockSpotifyModel.getRecentlyPlayedTracks).to.have.been.calledOnceWithExactly(userId);
            expect(savePlayedTracksJob.getLastSavedPlayedTrack).to.have.been.calledOnceWithExactly(userId);
            expect(savePlayedTracksJob.filterOutTracksPreviouslySaved).to.have.been.calledOnceWithExactly(recentlyPlayedTracks, lastSavedPlayedTrack);
            expect(mockPlayedTracksModel.savePlayedTracks).to.have.been.calledOnceWithExactly(recentlyPlayedTracks);
        });
    });

    describe('savePlayedTracks', () => {
        const userId = 'Slowthai';
        const playedTracks: PlayedTrack[] = [
            buildPlayedTrack({ userId, playedAt: new Date('2021-01-01T00:00:00.000Z') }),
            buildPlayedTrack({ userId, playedAt: new Date('2021-01-01T01:00:00.000Z') }),
            buildPlayedTrack({ userId, playedAt: new Date('2021-01-01T01:03:40.010Z') })
        ];

        beforeEach(() => {
            mockPlayedTracksModel.savePlayedTracks.resolves();
        });

        afterEach(() => {
            mockPlayedTracksModel.savePlayedTracks.reset();
        });

        it('should call the playedTracks model to save the user\'s played tracks', async () => {
            await savePlayedTracksJob.savePlayedTracks(playedTracks);

            expect(mockPlayedTracksModel.savePlayedTracks).to.have.been.calledOnceWithExactly(playedTracks);
        });
    });

    describe('getLastSavedPlayedTrack', () => {
        const userId = 'tywin-lannister';
        const mockPlayedTrack: PlayedTrack = buildPlayedTrack();

        beforeEach(() => {
            mockPlayedTracksModel.getLastSavedPlayedTrack.resolves(mockPlayedTrack);
        });

        afterEach(() => {
            mockPlayedTracksModel.getLastSavedPlayedTrack.reset();
        });

        it('should call the playedTracksModel to get the user\'s last played track, and return it', async () => {
            const lastSavedPlayedTrack: PlayedTrack = await savePlayedTracksJob.getLastSavedPlayedTrack(userId);

            expect(lastSavedPlayedTrack).to.eql(mockPlayedTrack);
            expect(mockPlayedTracksModel.getLastSavedPlayedTrack).to.have.been.calledOnceWithExactly(userId);
        });
    });

    describe('filterOutTracksPreviouslySaved', () => {
        it('should only keep played tracks that were played after the last saved track', () => {
            const recentlyPlayedTracks: PlayedTrack[] = [
                buildPlayedTrack({ playedAt: new Date('2021-01-01T00:00:00.000Z') }),
                buildPlayedTrack({ playedAt: new Date('2021-01-02T01:09:34.230Z') }),
                buildPlayedTrack({ playedAt: new Date('2021-01-01T01:00:00.000Z') }),
                buildPlayedTrack({ playedAt: new Date('2021-01-01T01:03:40.010Z') })
            ];
            const lastSavedTrack: PlayedTrack = buildPlayedTrack({ playedAt: new Date('2021-01-02T00:00:00.000Z') });

            const expectedResult: PlayedTrack[] = recentlyPlayedTracks.slice(1, 2);

            const result: PlayedTrack[] = savePlayedTracksJob.filterOutTracksPreviouslySaved(recentlyPlayedTracks, lastSavedTrack);

            expect(result).to.eql(expectedResult);
        });

        it('should keep all played tracks if the user\'s last saved track is undefined', () => {
            const recentlyPlayedTracks: PlayedTrack[] = [
                buildPlayedTrack({ playedAt: new Date('2021-08-16T07:04:05.701Z') }),
                buildPlayedTrack({ playedAt: new Date('2021-08-16T07:08:03.560Z') })
            ];

            const lastSavedTrack = undefined;

            const expectedResult: PlayedTrack[] = recentlyPlayedTracks;

            const result: PlayedTrack[] = savePlayedTracksJob.filterOutTracksPreviouslySaved(recentlyPlayedTracks, lastSavedTrack);

            expect(result).to.eql(expectedResult);
        });

        it('should remove the last saved track when it is part of the recentlyPlayedTracks list', () => {
            const recentlyPlayedTracks: PlayedTrack[] = [
                buildPlayedTrack({ playedAt: new Date('2021-01-01T00:00:00.000Z') }),
                buildPlayedTrack({ playedAt: new Date('2021-01-01T01:00:00.000Z') }),
                buildPlayedTrack({ playedAt: new Date('2021-01-01T01:03:40.010Z') }),
                buildPlayedTrack({ playedAt: new Date('2021-01-01T01:09:34.230Z') })
            ];
            const lastSavedTrack: PlayedTrack = buildPlayedTrack({ playedAt: new Date('2021-01-01T01:00:00.000Z') });

            const expectedResult: PlayedTrack[] = recentlyPlayedTracks.slice(2, );

            const result: PlayedTrack[] = savePlayedTracksJob.filterOutTracksPreviouslySaved(recentlyPlayedTracks, lastSavedTrack);

            expect(result).to.eql(expectedResult);
        });
    });
});