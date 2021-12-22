import { savePlayedTracksJob } from '../../../../src/jobs';
import { PlayedTrack } from '../../../ts';
import { resetDynamoDBTables } from '../../../../src/utils/dynamoDBTableUtils';

describe('integration/src/jobs/save-played-tracks-job.ts', () => {
    describe('getTrackHistory', () => {
        it('todo', async () => {
            await resetDynamoDBTables();
        });
    });

    describe('getLastPlayedTrack', () => {
        it('todo', async () => {
            const lastSavedPlayedTrack: PlayedTrack = await savePlayedTracksJob.getLastSavedPlayedTrack('xdrk');
        });
    });

    // describe('run', () => {
    //     it('todo', async () => {
    //         const userId: string = 'xdrk';

    //         const playedTracks: PlayedTrack[] = [{
    //             spotifyUri: 'spotify:track:091n9MH1VUepOdhnv7SLci',
    //             spotifyId: '091n9MH1VUepOdhnv7SLci',
    //             artistNames: ['Denzel Curry'],
    //             playedAt: new Date('2021-08-16T07:04:05.701Z'),
    //             trackName: 'The Game'
    //         }];

    //         await playedTracksModel.savePlayedTracks(userId, playedTracks);
    //     });
    // });

    // describe('run', () => {
    //     it.only('todo', async () => {
    //         const userId: string = 'xdrk';

    //         await savePlayedTracksJob.run(userId);
    //     });
    // });
});