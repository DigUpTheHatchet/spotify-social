import { AxiosInstance } from "axios";
import { spotifyAccessToken } from '../config';
import { RecentlyPlayedItem } from "../ts";

const RECENTLY_PLAYED_URL: string = 'https://api.spotify.com/v1/me/player/recently-played';

export default class SpotifyClient {
    private axiosInstance: AxiosInstance;

    constructor(axiosInstance: AxiosInstance) {
        this.axiosInstance = axiosInstance;
    }

    async getRecentlyPlayedItems(): Promise<RecentlyPlayedItem[]> {
        const options = { headers: { 'Authorization': `Bearer ${spotifyAccessToken}` }, params: { limit: 50 }};

        return this.axiosInstance.get(RECENTLY_PLAYED_URL, options)
            .then(response => parseRecentlyPlayedItems(response));
    }
}

function parseRecentlyPlayedItems(response): RecentlyPlayedItem[] {
    const rawItems = response.data.items;

    const recentlyPlayedItems: RecentlyPlayedItem[] = rawItems.map(item => {
        console.log({x: JSON.stringify(item.track.artists)})
        return {
            trackName: item.track.name,
            playedAt: new Date(item.played_at),
            artistNames: (item.track.artists || []).map(artist => artist.name)
        }
    });

    return recentlyPlayedItems;
}