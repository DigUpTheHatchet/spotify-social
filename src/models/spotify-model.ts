import * as querystring from 'querystring';

import {
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET
} from '../config';
import { PlayedTrack, SpotifyToken, SpotifyTokenStorage, TokenData } from '../ts';
import HttpClient from '../services/http-client';

const RECENTLY_PLAYED_URL: string = 'https://api.spotify.com/v1/me/player/recently-played';
const REFRESH_ACCESS_TOKEN_URL: string = 'https://accounts.spotify.com/api/token';
const CURRENTLY_PLAYING_URL: string = 'https://api.spotify.com/v1/me/player/currently-playing';

export class SpotifyModel {
    private httpClient: HttpClient;
    private tokenStorage: SpotifyTokenStorage;

    constructor(httpClient: HttpClient, tokenStorage: SpotifyTokenStorage) {
        this.httpClient = httpClient;
        this.tokenStorage = tokenStorage;
    }

    async getRecentlyPlayedTracks(userId: string): Promise<PlayedTrack[]> {
        const accessToken: SpotifyToken = await this.getRefreshedAccessToken(userId);
        const options = { headers: { 'Authorization': `Bearer ${accessToken.value}` }, params: { limit: 50 }};

        return this.httpClient.get(RECENTLY_PLAYED_URL, options)
            .then(data => this.parseRecentlyPlayedTracks(userId, data));
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

    async saveRefreshToken(tokenData: TokenData): Promise<void> {
        const { userId, value, scopes } = tokenData;

        const refreshToken: SpotifyToken = {
            userId,
            value,
            scopes,
            createdAt: new Date(),
            type: 'refresh'
        };

        await this.tokenStorage.saveToken(refreshToken);
    }

    parseRecentlyPlayedTracks(userId: string, data: any): PlayedTrack[] {
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

    // async getCurrentlyPlaying(userId: string) {
    //     const accessToken: SpotifyToken = await this.getRefreshedAccessToken(userId);
    //     const options = { headers: { 'Authorization': `Bearer ${accessToken.value}` } };

    //     return this.httpClient.get(CURRENTLY_PLAYING_URL, options);
    // }