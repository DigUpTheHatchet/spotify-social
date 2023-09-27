import Bluebird from 'bluebird';
import { expect } from 'chai';

import { spotifyModel, spotifyUserStorage } from '../../../../src/models';
import { SPOTIFY_REFRESH_TOKEN_ITS, SPOTIFY_REFRESH_TOKEN_SCOPES_ITS } from '../../../../src/config';
import { PlayedTrack, SpotifyToken, SpotifyUser, SpotifyUserData } from '../../../ts';
import { resetDynamoDBTables } from '../../../../src/utils/dynamoDBTableUtils';
import { buildSpotifyUser, buildSpotifyUserData } from '../../../fixtures';

async function prepareTestTables(usersData?: SpotifyUserData[], users?: SpotifyUser[]): Promise<void> {
    await resetDynamoDBTables();

    if (usersData) {
        await Bluebird.each(usersData, (userData) => spotifyModel.registerUser(userData));
    }

    if (users) {
        await Bluebird.each(users, (user) => spotifyUserStorage.saveUser(user));
    }
}

describe('integration/src/models/spotify-model.ts', () => {
    describe('getRecentlyPlayedTracks', () => {
        const userId = 'bobthebuilder';

        const usersData: SpotifyUserData[] = [buildSpotifyUserData({
            userId,
            refreshToken: SPOTIFY_REFRESH_TOKEN_ITS!,
            scopes: SPOTIFY_REFRESH_TOKEN_SCOPES_ITS!.split(' ')
        })];

        beforeEach(async () => {
            await prepareTestTables(usersData);
        });

        it('should retrieve the user\'s recently played tracks from Spotify', async () => {
            const playedTracks: PlayedTrack[] = await spotifyModel.getRecentlyPlayedTracks(userId);

            expect(playedTracks).to.be.an('array').and.to.have.length.greaterThan(5);

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
        const expectedScopes = SPOTIFY_REFRESH_TOKEN_SCOPES_ITS!.split(' ');

        const usersData: SpotifyUserData[] = [buildSpotifyUserData({
            userId,
            refreshToken: SPOTIFY_REFRESH_TOKEN_ITS!,
            scopes: expectedScopes
        })];

        beforeEach(async () => {
            await prepareTestTables(usersData);
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

    describe('registerUser', () => {
        const userId = 'bobgeldof';

        beforeEach(async () => {
            await prepareTestTables([]);
        });

        it('should save the refresh token and user in the database', async () => {
            const userData: SpotifyUserData = buildSpotifyUserData({
                userId,
                refreshToken: SPOTIFY_REFRESH_TOKEN_ITS!
            });

            const expectedUser: SpotifyUser = buildSpotifyUser({
                userId,
                email: userData.email,
                registeredAt: userData.registeredAt,
                isEnabled: true
            });

            await spotifyModel.registerUser(userData);

            const user: SpotifyUser = await spotifyModel.getUser(userId);
            const token: SpotifyToken = await spotifyModel.getRefreshedAccessToken(userId);

            expect(user).to.eql(expectedUser);

            expect(token.userId).to.eql(userId);
            expect(token.type).to.eql('access');
            expect(token.scopes).to.eql(['user-read-currently-playing', 'user-read-email', 'user-read-recently-played', 'user-read-private']);
            expect(token.value).to.not.be.null.and.to.be.an.instanceof(String);
            expect(token.createdAt).to.be.an.instanceof(Date);
        });
    });

    describe('getUser', () => {
        const userId = 'rickygervais';
        const usersData: SpotifyUserData[] = [
            buildSpotifyUserData({ userId: 'randomUserYay' }),
            buildSpotifyUserData({ userId }),
            buildSpotifyUserData({ userId: 'someOtherUser' })
        ];

        beforeEach(async () => {
            await prepareTestTables(usersData);
        });

        it('should retrieve the user from the database', async () => {
            const expectedUser: SpotifyUser = buildSpotifyUser({
                userId,
                email: usersData[1].email,
                registeredAt: usersData[1].registeredAt
            });

            const user: SpotifyUser = await spotifyModel.getUser(userId);

            expect(user).to.eql(expectedUser);
        });
    });

    describe('getEnabledUsers', () => {
        const users: SpotifyUser[] = [
            buildSpotifyUser({ userId: 'blue', isEnabled: false, email: 'blue@1.com' }),
            buildSpotifyUser({ userId: 'green', isEnabled: true, email: 'green@1.com' }),
            buildSpotifyUser({ userId: 'yellow', isEnabled: true, email: 'yellow@1.com' })
        ];

        beforeEach(async () => {
            await prepareTestTables([], users);
        });

        it('should retieve all enabled users from the database', async () => {
            const expectedEnabledUsers: SpotifyUser[] = [
                buildSpotifyUser({ userId: users[1].userId, email: users[1].email, registeredAt: users[1].registeredAt }),
                buildSpotifyUser({ userId: users[2].userId, email: users[2].email, registeredAt: users[2].registeredAt })
            ];

            const enabledUsers: SpotifyUser[] = await spotifyModel.getEnabledUsers();

            expect(enabledUsers).to.eql(expectedEnabledUsers);
        });
    });
});