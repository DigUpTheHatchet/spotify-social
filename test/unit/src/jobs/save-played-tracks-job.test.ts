import { expect } from 'chai';
import sinon from 'sinon';
import { stubInterface } from 'ts-sinon';

import { SavePlayedTracksJob } from '../../../../src/jobs/save-played-tracks-job';
import { PlayedTrack } from '../../../ts';
import { buildPlayedTrack } from '../../../fixtures';
import { PlayedTracksModel } from '../../../models/played-tracks-model';
import SpotifyClient from '../../../services/spotify-client';

const mockSpotifyClient = stubInterface<SpotifyClient>();
const mockPlayedTracksModel = stubInterface<PlayedTracksModel>();
const savePlayedTracksJob: SavePlayedTracksJob = new SavePlayedTracksJob(mockSpotifyClient, mockPlayedTracksModel);

describe.only('unit/src/jobs/save-played-tracks-job.ts', () => {
    describe.skip('run', () => {
        it('should', async () => {

        });
    });

    describe('savePlayedTracks', () => {
        const userId = 'Slowthai';
        const playedTracks: PlayedTrack[] = [
            buildPlayedTrack({ playedAt: new Date('2021-01-01T00:00:00.000Z') }),
            buildPlayedTrack({ playedAt: new Date('2021-01-01T01:00:00.000Z') }),
            buildPlayedTrack({ playedAt: new Date('2021-01-01T01:03:40.010Z') })
        ];

        beforeEach(() => {
            mockPlayedTracksModel.savePlayedTracks.resolves();
        });

        afterEach(() => {
            mockPlayedTracksModel.savePlayedTracks.reset();
        });

        it('should call the playedTracks model to save the user\s played tracks', async () => {
            await savePlayedTracksJob.savePlayedTracks(userId, playedTracks);

            expect(mockPlayedTracksModel.savePlayedTracks).to.have.been.calledOnceWithExactly(userId, playedTracks);
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

        it('should call the playedTracksModel to get the user\s last saved track, and return it', async () => {
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