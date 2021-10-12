import * as querystring from 'querystring';

import {
    spotifyAccessToken,
    spotifyRefreshToken,
    spotifyClientId,
    spotifyClientSecret
} from '../config';
import { PlayedTrack } from '../ts';
import HttpClient from './http-client';

const RECENTLY_PLAYED_URL: string = 'https://api.spotify.com/v1/me/player/recently-played';
const REFRESH_ACCESS_TOKEN_URL: string = 'https://accounts.spotify.com/api/token';
const CURRENTLY_PLAYING_URL: string = 'https://api.spotify.com/v1/me/player/currently-playing';

export default class SpotifyClient {
    private httpClient: HttpClient;

    constructor(httpClient: HttpClient) {
        this.httpClient = httpClient;
    }

    async getRecentlyPlayedTracks(): Promise<PlayedTrack[]> {
        const options = { headers: { 'Authorization': `Bearer ${spotifyAccessToken}` }, params: { limit: 50 }};

        return this.httpClient.get(RECENTLY_PLAYED_URL, options)
            .then(data => parseRecentlyPlayedTracks(data));
    }

    async getRefreshedAccessToken(): Promise<String> {
        const options = { headers: { 'Authorization': 'Basic ' + (new Buffer(spotifyClientId + ':' + spotifyClientSecret).toString('base64')), 'Content-Type': 'application/x-www-form-urlencoded' } };
        const body: string = querystring.stringify({ grant_type: 'refresh_token', refresh_token: spotifyRefreshToken });

        return this.httpClient.post(REFRESH_ACCESS_TOKEN_URL, body, options)
            .then(response => response.data);
    }

    async getCurrentlyPlaying() {
        const options = { headers: { 'Authorization': `Bearer ${spotifyAccessToken}` } };

        return this.httpClient.get(CURRENTLY_PLAYING_URL, options);
    }
}

function parseRecentlyPlayedTracks(data): PlayedTrack[] {
    const rawItems = data.items;

    const playedTracks: PlayedTrack[] = rawItems.map(item => {
        return {
            id: item.track.id,
            uri: item.track.uri,
            trackName: item.track.name,
            playedAt: new Date(item.played_at),
            artistNames: (item.track.artists || []).map(artist => artist.name)
        };
    });

    return playedTracks;
}