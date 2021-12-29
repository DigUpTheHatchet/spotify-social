import { savePlayedTracksJob } from '../jobs';

export async function savePlayedTracksJobHandler(event: any, context: any) {
    console.log(`savePlayedTracksJobHandler executing at: ${new Date()}`);

    const userId = 'xdrk'; // TODO: Needs to run for all users
    const numPlayedTracksSaved: number = await savePlayedTracksJob.run(userId);

    console.log(`Saved ${numPlayedTracksSaved} played tracks for user: ${userId}.`);
}

export async function registerSpotifyUserHandler(event: any, context: any) {
    console.log(`registerSpotifyUserHandler executing at: ${new Date()}`);

    try {
        const parsed = parseRegisterSpotifyUserPayload(event);
        console.log({ parsed });

        return { statusCode: 200 };
    } catch (err) {
        console.error({ err })
    }

    return { statusCode: 500 };
}


// TODO: Decrypt the request body here, and return a 403? if the decrypted payload is corrupted
// TODO: Type this return
function parseRegisterSpotifyUserPayload(event: any) {
    console.log(`Raw payload: ${JSON.stringify(event)}.`);

    const parsed = {
        value: event.refreshToken,
        scopes: event.scopes.split(' '),
        userId: event.userId,
        email: event.email
    };

    return parsed;
}