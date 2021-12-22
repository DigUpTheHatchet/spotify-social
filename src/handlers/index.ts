import { savePlayedTracksJob } from '../jobs';

export async function savePlayedTracksJobHandler(event: any, context: any) {
    // const userId = 'xdrk'; // TODO: Needs to run for all users
    // await savePlayedTracksJob.run(userId);
    console.log(`Handler executing at: ${new Date()}`);
}