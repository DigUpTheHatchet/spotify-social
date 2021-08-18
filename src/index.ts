import { spotifyClient } from "./services";
import { RecentlyPlayedItem } from "./ts";

async function run() {
    //const recentlyPlayedItems: RecentlyPlayedItem[] = await spotifyClient.getRecentlyPlayed();
    const data = await spotifyClient.getCurrentlyPlaying();
    console.log({data})
}

run();