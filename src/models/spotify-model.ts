import * as querystring from 'querystring';

import {
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET
} from '../config';
import { PlayedTrack, SpotifyToken, SpotifyTokenStorage, SpotifyUser, SpotifyUserData, SpotifyUserStorage } from '../ts';
import HttpClient from '../services/http-client';

const RECENTLY_PLAYED_URL: string = 'https://api.spotify.com/v1/me/player/recently-played';
const REFRESH_ACCESS_TOKEN_URL: string = 'https://accounts.spotify.com/api/token';

export class SpotifyModel {
    private httpClient: HttpClient;
    private userStorage: SpotifyUserStorage;
    private tokenStorage: SpotifyTokenStorage;

    constructor(httpClient: HttpClient, userStorage: SpotifyUserStorage, tokenStorage: SpotifyTokenStorage) {
        this.httpClient = httpClient;
        this.userStorage = userStorage;
        this.tokenStorage = tokenStorage;
    }

    async getRecentlyPlayedTracks(userId: string): Promise<PlayedTrack[]> {
        const accessToken: SpotifyToken = await this.getRefreshedAccessToken(userId);
        const options = { headers: { 'Authorization': `Bearer ${accessToken.value}` }, params: { limit: 50 }};

        return this.httpClient.get(RECENTLY_PLAYED_URL, options)
            .then(data => this.parseRawRecentlyPlayedTracks(userId, data));
    }

    async getRefreshedAccessToken(userId: string): Promise<SpotifyToken> {
        const refreshToken: SpotifyToken = await this.tokenStorage.getRefreshToken(userId);
        const options = { headers: { 'Authorization': 'Basic ' + (Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')), 'Content-Type': 'application/x-www-form-urlencoded' } };
        const body: string = querystring.stringify({ grant_type: 'refresh_token', refresh_token: refreshToken.value });

        return this.httpClient.post(REFRESH_ACCESS_TOKEN_URL, body, options)
            .then(data => {
                return {
                    value: data['access_token'],
                    type: 'access',
                    userId,
                    createdAt: new Date(),
                    scopes: data['scope'].split(' ')
                };
            });
    }

    async registerUser(userData: SpotifyUserData): Promise<void> {
        const { userId, email, scopes, registeredAt, name } = userData;

        const refreshToken: SpotifyToken = { userId, value: userData.refreshToken, scopes, createdAt: registeredAt, type: 'refresh' };
        const user: SpotifyUser = { userId, email, name, registeredAt, isEnabled: true };

        await this.tokenStorage.saveToken(refreshToken);
        await this.userStorage.saveUser(user);
    }

    async getUser(userId: string): Promise<SpotifyUser> {
        return this.userStorage.getUser(userId);
    }

    async getEnabledUsers(): Promise<SpotifyUser[]> {
        const allUsers: SpotifyUser[] = await this.userStorage.getAllUsers();
        const enabledUsers: SpotifyUser[] = allUsers.filter(user => user.isEnabled);

        return enabledUsers;
    }

    parseRawRecentlyPlayedTracks(userId: string, data: any): PlayedTrack[] {
        const rawItems = data.items;
        const playedTracks: PlayedTrack[] = rawItems.map(item => {
            return {
                spotifyId: item.track.id,
                spotifyUri: item.track.uri,
                trackName: item.track.name,
                playedAt: new Date(item.played_at),
                userId,
                artistNames: (item.track.artists || []).map(artist => artist.name)
            };
        });

        return playedTracks;
    }
}