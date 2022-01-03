import { expect } from 'chai';
import { stubInterface } from 'ts-sinon';

import { PlayedTrack, PlayedTracksStorage } from '../../../ts';
import { buildPlayedTrack } from '../../../fixtures';
import { PlayedTracksModel } from '../../../../src/models/played-tracks-model';

const mockPlayedTracksStorage = stubInterface<PlayedTracksStorage>();
const playedTracksModel = new PlayedTracksModel(mockPlayedTracksStorage);

describe('unit/src/models/played-tracks-model.ts', () => {
    describe('getLastSavedPlayedTrack', () => {
        const userId = 'winniethepooh';
        const expectedPlayedTrack: PlayedTrack = buildPlayedTrack({ userId });

        beforeEach(() => {
            mockPlayedTracksStorage.getLastSavedPlayedTrack.resolves(expectedPlayedTrack);
        });

        afterEach(() => {
            mockPlayedTracksStorage.getLastSavedPlayedTrack.reset();
        });

        it('should call getLastSavedPlayedTrack to get and return the user\'s last saved played track', async () => {
            const playedTrack: PlayedTrack = await playedTracksModel.getLastSavedPlayedTrack(userId);

            expect(playedTrack).to.eql(expectedPlayedTrack);
            expect(mockPlayedTracksStorage.getLastSavedPlayedTrack).to.have.been.calledOnceWithExactly(userId);
        });
    });

    describe('savePlayedTracks', () => {
        const playedTracks: PlayedTrack[] = [
            buildPlayedTrack({ userId: 'red' }),
            buildPlayedTrack({ userId: 'green' }),
            buildPlayedTrack({ userId: 'blue' }),
        ];

        beforeEach(() => {
            mockPlayedTracksStorage.savePlayedTracks.resolves();
        });

        afterEach(() => {
            mockPlayedTracksStorage.savePlayedTracks.reset();
        });

        it('should call savePlayedTracks with the played tracks', async () => {
            await playedTracksModel.savePlayedTracks(playedTracks);

            expect(mockPlayedTracksStorage.savePlayedTracks).to.have.been.calledOnceWithExactly(playedTracks);
        });
    });

    describe('getPlayedTracks', () => {
        const userId = 'barneyrubble';
        const startDate = new Date('2021-01-01T00:00:00.000Z');
        const endDate = new Date('2021-01-10T00:00:00.000Z');

        const mockPlayedTracks: PlayedTrack[] = [
            buildPlayedTrack({ userId }),
            buildPlayedTrack({ userId }),
        ];

        beforeEach(() => {
            mockPlayedTracksStorage.getPlayedTracks.resolves(mockPlayedTracks);
        });

        afterEach(() => {
            mockPlayedTracksStorage.savePlayedTracks.reset();
        });

        it('should call getPlayedTracks for the specified user/date range and return the tracks', async () => {
            const playedTracks: PlayedTrack[] = await playedTracksModel.getPlayedTracks(userId, startDate, endDate);

            expect(playedTracks).to.eql(mockPlayedTracks);
            expect(mockPlayedTracksStorage.getPlayedTracks).to.have.been.calledOnceWithExactly(userId, startDate, endDate);
        });
    });
});