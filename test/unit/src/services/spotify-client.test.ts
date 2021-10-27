import { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import sinon from 'sinon';

import SpotifyClient from '../../../../src/services/spotify-client';
import HttpClient from '../../../../src/services/http-client';
import { PlayedTrack, SpotifyToken, SpotifyTokenStorage } from '../../../../src/ts';
import { buildPlayedTrack, buildSpotifyToken } from '../../../fixtures';

const mockHttpClient = stubInterface<HttpClient>();
const mockSpotifyTokenStorage = stubInterface<SpotifyTokenStorage>();
const spotifyClient: SpotifyClient = new SpotifyClient(mockHttpClient, mockSpotifyTokenStorage);

describe('unit/src/services/spotify-client.ts', () => {
    const userId = 'wayne';

    describe('getRecentlyPlayedTracks', () => {
        const accessToken: SpotifyToken = buildSpotifyToken({ type: 'access' });


        const recentlyPlayedTracks: PlayedTrack[] = [
            buildPlayedTrack({
                spotifyUri: 'spotify:track:091n9MH1VUepOdhnv7SLci',
                spotifyId: '091n9MH1VUepOdhnv7SLci',
                trackName: 'YOLO',
                artistNames: ['Drake'],
                playedAt: new Date('2021-01-02T00:00:00.000Z')
            }),
            buildPlayedTrack({
                spotifyUri: 'spotify:track:fg04309dgfggd43434fff',
                spotifyId: 'fg04309dgfggd43434fff',
                trackName: 'Goodbye',
                artistNames: ['The Beetles'],
                playedAt: new Date('2021-01-02T01:03:55.000Z')
            })
        ];

        const rawSpotifyReturn = {
            items: [{
                track: {
                    id: '091n9MH1VUepOdhnv7SLci',
                    uri: 'spotify:track:091n9MH1VUepOdhnv7SLci',
                    name: 'YOLO',
                    artists: [{ name: 'Drake' }]
                },
                played_at: '2021-01-02T00:00:00.000Z'
            }, {
                track: {
                    id: 'fg04309dgfggd43434fff',
                    uri: 'spotify:track:fg04309dgfggd43434fff',
                    name: 'Goodbye',
                    artists: [{ name: 'The Beetles' }]
                },
                played_at: '2021-01-02T01:03:55.000Z'
            }]
        };

        beforeEach(() => {
            sinon.stub(spotifyClient, 'getRefreshedAccessToken').resolves(accessToken);
            mockHttpClient.get.resolves(rawSpotifyReturn);
        });

        afterEach(() => {
            (spotifyClient.getRefreshedAccessToken as sinon.SinonStub).restore();
            mockHttpClient.get.reset();
        });

        it('should', async () => {
            const expectedUrl = 'https://api.spotify.com/v1/me/player/recently-played';
            const expectedGetOptions = { headers: { 'Authorization': `Bearer ${accessToken.value}` }, params: { limit: 50 }};
            const expectedResult: PlayedTrack[] = recentlyPlayedTracks;

            const result: PlayedTrack[] = await spotifyClient.getRecentlyPlayedTracks(userId);

            expect(result).to.deep.equal(expectedResult);
            expect(spotifyClient.getRefreshedAccessToken).calledOnceWithExactly(userId);
            expect(mockHttpClient.get).to.have.been.calledOnceWithExactly(expectedUrl, expectedGetOptions);
        });
    });

    describe('getRefreshedAccessToken', () => {

        beforeEach(() => {

        });

        afterEach(() => {

        });

        it('should', async () => {

        });
    });

    // describe('getCurrentlyPlaying', () => {
    //     const accessToken: SpotifyToken = buildSpotifyToken({ type: 'access' });

    //     beforeEach(() => {
    //         sinon.stub(spotifyClient, 'getRefreshedAccessToken').resolves(accessToken);
    //     });

    //     afterEach(() => {
    //         (spotifyClient.getRefreshedAccessToken as sinon.SinonStub).restore();
    //     });

    //     it('should', async () => {

    //     });
    // });

    describe('run', () => {
        // const userId = 'ryangosling';
        // const lastSavedTrack: PlayedTrack = buildPlayedTrack({ playedAt: new Date('2021-01-01T01:00:00.000Z') })
        // const recentlyPlayedTracks: PlayedTrack[] = [
        //     buildPlayedTrack({ playedAt: new Date('2021-01-02T00:00:00.000Z') }),
        //     buildPlayedTrack({ playedAt: new Date('2021-01-02T01:00:00.000Z') })
        // ];

        // beforeEach(() => {
        //     mockSpotifyClient.getRecentlyPlayedTracks.resolves(recentlyPlayedTracks);
        //     sinon.stub(savePlayedTracksJob, 'getLastSavedTrack').resolves(lastSavedTrack);
        //     sinon.stub(savePlayedTracksJob, 'filterOutTracksPreviouslySaved').returns(recentlyPlayedTracks);
        //     mockPlayedTracksModel.savePlayedTracks.resolves();
        // });

        // afterEach(() => {
        //     mockSpotifyClient.getRecentlyPlayedTracks.reset();
        //     (savePlayedTracksJob.getLastSavedTrack as sinon.SinonStub).restore();
        //     (savePlayedTracksJob.filterOutTracksPreviouslySaved as sinon.SinonStub).restore();
        //     mockPlayedTracksModel.savePlayedTracks.reset();
        // });

        // it('should get & save the user\'s recently played tracks', async () => {
        //     await savePlayedTracksJob.run(userId);

        //     expect(mockSpotifyClient.getRecentlyPlayedTracks).to.have.been.calledOnceWithExactly(userId);
        //     expect(savePlayedTracksJob.getLastSavedTrack).to.have.been.calledOnceWithExactly(userId);
        //     expect(savePlayedTracksJob.filterOutTracksPreviouslySaved).to.have.been.calledOnceWithExactly(recentlyPlayedTracks, lastSavedTrack);
        //     expect(mockPlayedTracksModel.savePlayedTracks).to.have.been.calledOnceWithExactly(userId, recentlyPlayedTracks);
        // });
    });
});