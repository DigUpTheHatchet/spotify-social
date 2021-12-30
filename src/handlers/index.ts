import { savePlayedTracksJob } from '../jobs';
import { spotifyModel } from '../models';
import { SpotifyUserData } from '../ts';

export async function savePlayedTracksJobHandler(event: any, context: any) {
    console.log(`savePlayedTracksJobHandler executing at: ${new Date()}`);

    const userId = 'xdrk'; // TODO: Needs to run for all users
    const numPlayedTracksSaved: number = await savePlayedTracksJob.run(userId);

    console.log(`Saved ${numPlayedTracksSaved} played tracks for user: ${userId}.`);
}

export async function registerSpotifyUserHandler(event: any, context: any) {
    console.log(`registerSpotifyUserHandler executing at: ${new Date()}`);

    try {
        const userData: SpotifyUserData = parseSpotifyUserData(event);
        await spotifyModel.registerUser(userData);

        return { statusCode: 200 };
    } catch (err) {
        console.error({ err });
    }

    return { statusCode: 500 };
}


// TODO: Decrypt the request body here, and return a 403? if the decrypted payload is corrupted
function parseSpotifyUserData(event: any): SpotifyUserData {
    console.log(`Raw payload: ${JSON.stringify(event)}.`);

    const userData: SpotifyUserData = {
        userId: event.userId,
        email: event.email,
        refreshToken: event.refreshToken,
        scopes: event.scopes.split(' '),
        registeredAt: new Date()
    };

    console.log(`Parsed User Data: ${JSON.stringify(userData)}.`);

    return userData;
}