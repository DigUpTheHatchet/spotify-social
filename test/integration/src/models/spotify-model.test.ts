import Bluebird from 'bluebird';
import { expect } from 'chai';
import { uniqueId } from 'lodash';
import sinon from 'sinon';

import { spotifyModel } from '../../../../src/models';
import { SPOTIFY_REFRESH_TOKEN_ITS } from '../../../../src/config';
import { PlayedTrack, SpotifyToken, TokenData } from '../../../ts';
import { resetDynamoDBTables } from '../../../../src/utils/dynamoDBTableUtils';

async function prepareTestTables(tokensData: TokenData[]): Promise<void> {
    await resetDynamoDBTables();

    if (tokensData) {
        await Bluebird.map(tokensData, (tokenData) => spotifyModel.saveRefreshToken(tokenData));
    }
}

describe('integration/src/models/spotify-model.ts', () => {
    describe('getRecentlyPlayedTracks', () => {
        const userId = 'bobthebuilder';
        // These are the scopes from the (SPOTIFY_REFRESH_TOKEN_ITS) refresh token used by the ITs
        const expectedScopes = ['user-modify-playback-state', 'user-read-currently-playing', 'user-read-email', 'user-read-recently-played', 'user-read-private'];

        const tokenData: TokenData = {
            userId,
            value: SPOTIFY_REFRESH_TOKEN_ITS!,
            scopes: expectedScopes
        };

        beforeEach(async () => {
            await prepareTestTables([tokenData]);
        });

        it('should retrieve the user\'s recently played tracks from Spotify', async () => {
            const playedTracks: PlayedTrack[] = await spotifyModel.getRecentlyPlayedTracks(userId);

            expect(playedTracks).to.be.an('array').and.to.have.length(50);

            // TODO: Make this functional
            for (const track of playedTracks) {
                expect(track['spotifyUri']).to.be.a.string;
                expect(track['spotifyId']).to.be.a.string;
                expect(track['trackName']).to.be.a.string;
                expect(track['userId']).to.be.a.string;
                expect(track['playedAt']).to.be.an.instanceOf(Date);
                expect(track['artistNames'].length).to.be.greaterThanOrEqual(1);
            }
        });
    });

    describe('getRefreshedAccessToken', () => {
        const userId = 'yellowcanary';
        // These are the scopes from the (SPOTIFY_REFRESH_TOKEN_ITS) refresh token used by the ITs
        const expectedScopes = ['user-modify-playback-state', 'user-read-currently-playing', 'user-read-email', 'user-read-recently-played', 'user-read-private'];

        const tokenData: TokenData = {
            userId,
            value: SPOTIFY_REFRESH_TOKEN_ITS!,
            scopes: expectedScopes
        };

        beforeEach(async () => {
            await prepareTestTables([tokenData]);
        });

        it('should retrieve a refreshed access token for the user from Spotify', async () => {
            const accessToken: SpotifyToken = await spotifyModel.getRefreshedAccessToken(userId);

            expect(accessToken.userId).to.eql(userId);
            expect(accessToken.scopes).to.eql(expectedScopes);
            expect(accessToken.type).to.eql('access');
            expect(accessToken.createdAt).to.be.an.instanceOf(Date);
            expect(accessToken.value).to.be.an('string').and.to.not.be.undefined;
        });
    });

    describe('saveRefreshToken', () => {
        const userId = 'bobgeldof';

        beforeEach(async () => {
            await prepareTestTables([]);
        });

        it('should save the user\'s Spotify refresh token in the database', async () => {
            // These are the scopes from the (SPOTIFY_REFRESH_TOKEN_ITS) refresh token used by the ITs
            const expectedScopes = ['user-modify-playback-state', 'user-read-currently-playing', 'user-read-email', 'user-read-recently-played', 'user-read-private'];

            const tokenData: TokenData = {
                userId,
                value: SPOTIFY_REFRESH_TOKEN_ITS!,
                scopes: expectedScopes
            };

            await spotifyModel.saveRefreshToken(tokenData);

            const accessToken: SpotifyToken = await spotifyModel.getRefreshedAccessToken(userId);

            expect(accessToken.userId).to.eql(userId);
            expect(accessToken.scopes).to.eql(expectedScopes);
            expect(accessToken.type).to.eql('access');
            expect(accessToken.createdAt).to.be.an.instanceOf(Date);
            expect(accessToken.value).to.be.an('string').and.to.not.be.undefined;
        });
    });

    // describe('getCurrentlyPlaying', async () => {
    //     it('', () => {

    //     });
    // });
});