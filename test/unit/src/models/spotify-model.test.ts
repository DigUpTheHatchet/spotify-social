import { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import sinon from 'sinon';
import { uniqueId } from 'lodash';
import * as _ from 'lodash';


import { SpotifyModel } from '../../../../src/models/spotify-model';
import HttpClient from '../../../../src/services/http-client';
import { PlayedTrack, SpotifyToken, SpotifyTokenStorage, SpotifyUser, SpotifyUserStorage } from '../../../../src/ts';
import { buildPlayedTrack, buildSpotifyToken, buildSpotifyUser, buildSpotifyUserData } from '../../../fixtures';
import { AxiosRequestConfig } from 'axios';

const mockHttpClient = stubInterface<HttpClient>();
const mockSpotifyTokenStorage = stubInterface<SpotifyTokenStorage>();
const mockSpotifyUserStorage = stubInterface<SpotifyUserStorage>();
const spotifyModel: SpotifyModel = new SpotifyModel(mockHttpClient, mockSpotifyUserStorage, mockSpotifyTokenStorage);

describe('unit/src/models/spotify-model.ts', () => {
    describe('getRecentlyPlayedTracks', () => {
        const userId = 'wayne';
        const accessToken: SpotifyToken = buildSpotifyToken({ userId, type: 'access' });

        const recentlyPlayedTracks: PlayedTrack[] = [
            buildPlayedTrack({
                spotifyUri: 'spotify:track:091n9MH1VUepOdhnv7SLci',
                spotifyId: '091n9MH1VUepOdhnv7SLci',
                trackName: 'YOLO',
                artistNames: ['Drake'],
                playedAt: new Date('2021-01-02T00:00:00.000Z'),
                userId
            }),
            buildPlayedTrack({
                spotifyUri: 'spotify:track:fg04309dgfggd43434fff',
                spotifyId: 'fg04309dgfggd43434fff',
                trackName: 'Goodbye',
                artistNames: ['The Beetles'],
                playedAt: new Date('2021-01-02T01:03:55.000Z'),
                userId
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
            sinon.stub(spotifyModel, 'getRefreshedAccessToken').resolves(accessToken);
            mockHttpClient.get.resolves(rawSpotifyReturn);
        });

        afterEach(() => {
            (spotifyModel.getRefreshedAccessToken as sinon.SinonStub).restore();
            mockHttpClient.get.reset();
        });

        it('should get a refreshed access token and use it to retrieve the user\'s recently played tracks', async () => {
            const expectedUrl = 'https://api.spotify.com/v1/me/player/recently-played';
            const expectedGetOptions = { headers: { 'Authorization': `Bearer ${accessToken.value}` }, params: { limit: 50 }};
            const expectedResult: PlayedTrack[] = recentlyPlayedTracks;

            const result: PlayedTrack[] = await spotifyModel.getRecentlyPlayedTracks(userId);

            expect(result).to.deep.equal(expectedResult);
            expect(spotifyModel.getRefreshedAccessToken).calledOnceWithExactly(userId);
            expect(mockHttpClient.get).to.have.been.calledOnceWithExactly(expectedUrl, expectedGetOptions);
        });
    });

    describe('getRefreshedAccessToken', () => {
        const userId = 'pillow1444';

        const mockRefreshToken: SpotifyToken = buildSpotifyToken({ userId });
        const mockAccessTokenValue: string = uniqueId();

        const rawSpotifyReturn = {
            access_token: mockAccessTokenValue,
            scope: 'user-do-something user-do-something-else'
        };

        beforeEach(() => {
            mockSpotifyTokenStorage.getRefreshToken.resolves(mockRefreshToken);
            mockHttpClient.post.resolves(rawSpotifyReturn);
        });

        afterEach(() => {
            mockSpotifyTokenStorage.saveToken.reset();
            mockHttpClient.post.reset();
        });


        it('should use the user\'s saved refresh token to retrieve a new access token from Spotify', async () => {
            const expectedUrl = 'https://accounts.spotify.com/api/token';
            const expectedBody = 'grant_type=refresh_token&refresh_token=2';

            const expectedContentType = 'application/x-www-form-urlencoded';

            const expectedScopes = ['user-do-something', 'user-do-something-else'];

            const accessToken: SpotifyToken = await spotifyModel.getRefreshedAccessToken(userId);

            expect(mockSpotifyTokenStorage.getRefreshToken).to.have.been.calledOnceWithExactly(userId);
            expect(mockHttpClient.post).to.have.been.calledOnce();

            expect(mockHttpClient.post.getCall(0).args[0]).to.eql(expectedUrl);
            expect(mockHttpClient.post.getCall(0).args[1]).to.eql(expectedBody);

            expect(_.get(mockHttpClient.post.getCall(0).args[2], 'headers.Content-Type')).to.eql(expectedContentType);
            expect(_.get(mockHttpClient.post.getCall(0).args[2], 'headers.Authorization')).to.a.string;

            expect(accessToken.scopes).to.eql(expectedScopes);
            expect(accessToken.userId).to.eql(userId);
            expect(accessToken.createdAt).to.be.an.instanceof(Date);
            expect(accessToken.value).to.eql(mockAccessTokenValue);
        });
    });

    describe('parseRawRecentlyPlayedTracks', () => {
        const userId = 'brickie';
        const rawRecentlyPlayedData = {
            items: [{
                played_at: '2022-01-01T00:00:00.000Z',
                track: {
                    id: 'abc123',
                    uri: 'spotify:track:abc123',
                    name: 'What could go wrong?',
                    artists: [{
                        name: 'Jack jones'
                    }]
                },
            }, {
                played_at: '2022-01-02T00:00:00.000Z',
                track: {
                    id: 'xyz789',
                    uri: 'spotify:track:xyz789',
                    name: 'Who asked for that?',
                    artists: [{
                        name: 'Jason Derulo'
                    }]
                }
            }]
        };

        it('should parse the data returned from spotify into the expected format', async () => {
            const expectedPlayedTracks = [{
                playedAt: new Date(rawRecentlyPlayedData.items[0].played_at),
                spotifyId: rawRecentlyPlayedData.items[0].track.id,
                spotifyUri: rawRecentlyPlayedData.items[0].track.uri,
                trackName: rawRecentlyPlayedData.items[0].track.name,
                userId,
                artistNames: ['Jack jones']
            }, {
                playedAt: new Date(rawRecentlyPlayedData.items[1].played_at),
                spotifyId: rawRecentlyPlayedData.items[1].track.id,
                spotifyUri: rawRecentlyPlayedData.items[1].track.uri,
                trackName: rawRecentlyPlayedData.items[1].track.name,
                userId,
                artistNames: ['Jason Derulo']
            }];

            const parsedPlayedTracks: PlayedTrack[] = spotifyModel.parseRawRecentlyPlayedTracks(userId, rawRecentlyPlayedData);

            expect(parsedPlayedTracks).to.eql(expectedPlayedTracks);
        });
    });

    describe('registerUser', () => {
        const userData = buildSpotifyUserData();

        beforeEach(() => {
            mockSpotifyUserStorage.saveUser.resolves();
            mockSpotifyTokenStorage.saveToken.resolves();
        });

        afterEach(() => {
            mockSpotifyUserStorage.saveUser.reset();
            mockSpotifyTokenStorage.saveToken.reset();
        });

        it('should save the user and their refresh token', async () => {
            const expectedRefreshToken: SpotifyToken = {
                userId: userData.userId,
                value: userData.refreshToken,
                scopes: userData.scopes,
                createdAt: userData.registeredAt,
                type: 'refresh'
            };

            const expectedUser: SpotifyUser = {
                userId: userData.userId,
                email: userData.email,
                name: userData.name,
                registeredAt: userData.registeredAt,
                isEnabled: true
            };

            await spotifyModel.registerUser(userData);

            expect(mockSpotifyTokenStorage.saveToken).to.have.been.calledOnceWithExactly(expectedRefreshToken);
            expect(mockSpotifyUserStorage.saveUser).to.have.been.calledOnceWithExactly(expectedUser);

            expect(mockSpotifyTokenStorage.saveToken).to.have.been.calledBefore(mockSpotifyUserStorage.saveUser);
        });
    });

    describe('getUser', () => {
        const userId = 'paulie';
        const expectedSpotifyUser: SpotifyUser = buildSpotifyUser({ userId });

        beforeEach(() => {
            mockSpotifyUserStorage.getUser.resolves(expectedSpotifyUser);
        });

        afterEach(() => {
            mockSpotifyUserStorage.getUser.reset();
        });

        it('retrieve the user from the database and return it', async () => {
            const spotifyUser: SpotifyUser = await spotifyModel.getUser(userId);

            expect(spotifyUser).to.eql(expectedSpotifyUser);
            expect(mockSpotifyUserStorage.getUser).to.have.been.calledOnceWithExactly(userId);
        });
    });

    describe('getEnabledUsers', () => {
        const mockUsers: SpotifyUser[] = [
            buildSpotifyUser({ userId: 'benjaminbutton', isEnabled: true }),
            buildSpotifyUser({ userId: 'yellowbelly', isEnabled: false }),
            buildSpotifyUser({ userId: 'boatlover99', isEnabled: true }),
        ];

        beforeEach(() => {
            mockSpotifyUserStorage.getAllUsers.resolves(mockUsers);
        });

        afterEach(() => {
            mockSpotifyUserStorage.getAllUsers.reset();
        });

        it('should retrieve and return the enabled users', async () => {
            const expectedEnabledUsers: SpotifyUser[] = [mockUsers[0], mockUsers[2]];

            const enabledUsers: SpotifyUser[] = await spotifyModel.getEnabledUsers();

            expect(enabledUsers).to.eql(expectedEnabledUsers);
            expect(mockSpotifyUserStorage.getAllUsers).to.have.been.calledOnceWithExactly();
        });
    });
});