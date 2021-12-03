import { savePlayedTracksJob } from '../jobs';

export async function savePlayedTracksJobHandler(event: any, context: any) {
    console.log('In Handler hiiiiii');
    const userId = 'xdrk'; // TODO: Needs to run for all users
    // await savePlayedTracksJob.run(userId);
}