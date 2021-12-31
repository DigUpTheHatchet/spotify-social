import { savePlayedTracksJob } from '../jobs';
import { spotifyModel } from '../models';
import { SpotifyUserData } from '../ts';

export async function savePlayedTracksJobHandler(event: any, context: any) {
    console.log(event.notexist.notexist);
    console.log(`savePlayedTracksJobHandler executing at: ${new Date()}`);
    const numEnabledUsers: number = await savePlayedTracksJob.run();

    console.log(`Saved played tracks for: ${numEnabledUsers} users.`);
}

export async function registerSpotifyUserHandler(event: any, context: any) {
    console.log(`registerSpotifyUserHandler executing at: ${new Date()}`);
    
    try {
        const userData: SpotifyUserData = parseSpotifyUserData(event);
        await spotifyModel.registerUser(userData);

        return { statusCode: 200 };
    } catch (err) {
        console.error({ err });
        throw err;
    }
}


// TODO: Decrypt the request body here, and return a 403? if the decrypted payload is corrupted
function parseSpotifyUserData(event: any): SpotifyUserData {
    console.log(`Raw payload: ${JSON.stringify(event)}.`);

    const userData: SpotifyUserData = {
        userId: event.userId,
        name: event.name,
        email: event.email,
        refreshToken: event.refreshToken,
        scopes: event.scopes.split(' '),
        registeredAt: new Date()
    };

    console.log(`Parsed User Data: ${JSON.stringify(userData)}.`);

    return userData;
}