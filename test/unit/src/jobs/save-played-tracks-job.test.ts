import { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import sinon from 'sinon';

import { SavePlayedTracksJob } from '../../../../src/jobs/save-played-tracks-job';
import { PlayedTrack } from '../../../ts';
import { buildPlayedTrack } from '../../../fixtures';
import { PlayedTracksModel } from '../../../models/played-tracks-model';
import { SpotifyModel } from '../../../../src/models/spotify-model';

const mockSpotifyModel = stubInterface<SpotifyModel>();
const mockPlayedTracksModel = stubInterface<PlayedTracksModel>();
const savePlayedTracksJob: SavePlayedTracksJob = new SavePlayedTracksJob(mockSpotifyModel, mockPlayedTracksModel);

describe('unit/src/jobs/save-played-tracks-job.ts', () => {
    describe('run', () => {
        const userId = 'ryangosling';
        const lastSavedTrack: PlayedTrack = buildPlayedTrack({ playedAt: new Date('2021-01-01T01:00:00.000Z') });
        const recentlyPlayedTracks: PlayedTrack[] = [
            buildPlayedTrack({ userId, playedAt: new Date('2021-01-02T00:00:00.000Z') }),
            buildPlayedTrack({ userId, playedAt: new Date('2021-01-02T01:00:00.000Z') })
        ];

        beforeEach(() => {
            mockSpotifyModel.getRecentlyPlayedTracks.resolves(recentlyPlayedTracks);
            sinon.stub(savePlayedTracksJob, 'getLastSavedTrack').resolves(lastSavedTrack);
            sinon.stub(savePlayedTracksJob, 'filterOutTracksPreviouslySaved').returns(recentlyPlayedTracks);
            mockPlayedTracksModel.savePlayedTracks.resolves();
        });

        afterEach(() => {
            mockSpotifyModel.getRecentlyPlayedTracks.reset();
            (savePlayedTracksJob.getLastSavedTrack as sinon.SinonStub).restore();
            (savePlayedTracksJob.filterOutTracksPreviouslySaved as sinon.SinonStub).restore();
            mockPlayedTracksModel.savePlayedTracks.reset();
        });

        it('should get & save the user\'s recently played tracks', async () => {
            await savePlayedTracksJob.run(userId);

            expect(mockSpotifyModel.getRecentlyPlayedTracks).to.have.been.calledOnceWithExactly(userId);
            expect(savePlayedTracksJob.getLastSavedTrack).to.have.been.calledOnceWithExactly(userId);
            expect(savePlayedTracksJob.filterOutTracksPreviouslySaved).to.have.been.calledOnceWithExactly(recentlyPlayedTracks, lastSavedTrack);
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

    describe('getLastSavedTrack', () => {
        const userId = 'tywin-lannister';
        const mockPlayedTrack: PlayedTrack = buildPlayedTrack();

        beforeEach(() => {
            mockPlayedTracksModel.getLastSavedTrack.resolves(mockPlayedTrack);
        });

        afterEach(() => {
            mockPlayedTracksModel.getLastSavedTrack.reset();
        });

        it('should call the playedTracksModel to get the user\'s last saved track, and return it', async () => {
            const lastSavedTrack: PlayedTrack = await savePlayedTracksJob.getLastSavedTrack(userId);

            expect(lastSavedTrack).to.eql(mockPlayedTrack);
            expect(mockPlayedTracksModel.getLastSavedTrack).to.have.been.calledOnceWithExactly(userId);
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