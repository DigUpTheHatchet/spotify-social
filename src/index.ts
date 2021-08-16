import { spotifyClient } from "./services";
import { RecentlyPlayedItem } from "./ts";

async function run() {
    const recentlyPlayedItems: RecentlyPlayedItem[] = await spotifyClient.getRecentlyPlayedItems();

    console.log({x: recentlyPlayedItems[0]})

}

run();