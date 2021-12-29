import { savePlayedTracksJob } from '../jobs';

export async function savePlayedTracksJobHandler(event: any, context: any) {
    console.log(`savePlayedTracksJobHandler executing at: ${new Date()}`);

    const userId = 'xdrk'; // TODO: Needs to run for all users
    const numPlayedTracksSaved: number = await savePlayedTracksJob.run(userId);

    console.log(`Saved ${numPlayedTracksSaved} played tracks for user: ${userId}.`);
}

export async function registerSpotifyUser(event: any, context: any) {
    console.log({payload: JSON.stringify(event)});
    return {
        statusCode: 200,
        body: 'Hello!!'
    };
}