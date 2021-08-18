import { AxiosInstance } from "axios";
import * as querystring from "querystring";

import { spotifyAccessToken, spotifyRefreshToken, spotifyClientId, spotifyClientSecret } from '../config';
import { RecentlyPlayedItem } from "../ts";

const RECENTLY_PLAYED_URL: string = 'https://api.spotify.com/v1/me/player/recently-played';
const REFRESH_ACCESS_TOKEN_URL: string = 'https://accounts.spotify.com/api/token';
const CURRENTLY_PLAYING_URL: string = 'https://api.spotify.com/v1/me/player/currently-playing';

export default class SpotifyClient {
    private axiosInstance: AxiosInstance;

    constructor(axiosInstance: AxiosInstance) {
        this.axiosInstance = axiosInstance;
    }

    async getRecentlyPlayed(): Promise<RecentlyPlayedItem[]> {
        const options = { headers: { 'Authorization': `Bearer ${spotifyAccessToken}` }, params: { limit: 50 }};
        return this.axiosInstance.get(RECENTLY_PLAYED_URL, options)
            .then(response => parseRecentlyPlayedItems(response));
    }

    async getRefreshedAccessToken(): Promise<String> {
        const options = { headers: { 'Authorization': 'Basic ' + (new Buffer(spotifyClientId + ':' + spotifyClientSecret).toString('base64')), 'Content-Type': 'application/x-www-form-urlencoded' } };
        const body = querystring.stringify({ grant_type: 'refresh_token', refresh_token: spotifyRefreshToken });
  
        return this.axiosInstance.post(REFRESH_ACCESS_TOKEN_URL, body, options)
            .then(response => response.data);
    }

    async getCurrentlyPlaying() {
        const options = { headers: { 'Authorization': `Bearer ${spotifyAccessToken}` } };

        return this.axiosInstance.get(CURRENTLY_PLAYING_URL, options)
            .then(response => response.data);
    }
}

function parseRecentlyPlayedItems(response): RecentlyPlayedItem[] {
    const rawItems = response.data.items;

    const recentlyPlayedItems: RecentlyPlayedItem[] = rawItems.map(item => {
        return {
            trackName: item.track.name,
            playedAt: new Date(item.played_at),
            artistNames: (item.track.artists || []).map(artist => artist.name)
        };
    });

    return recentlyPlayedItems;
}