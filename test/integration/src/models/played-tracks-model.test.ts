import { playedTracksModel } from '../../../../src/models';
import { PlayedTrack } from '../../../ts';

describe('integration/src/models/played-tracks-model.ts', () => {
    describe('getLastSavedTrack', () => {
        it.only('todo', async () => {
            const lastPlayedTrack: PlayedTrack = await playedTracksModel.getLastSavedTrack('xdrk');
            console.log({lastPlayedTrack});
        });
    });

    describe('savePlayedTracks', () => {
        it('todo', async () => {
            const userId: string = 'xdrk';

            const playedTracks: PlayedTrack[] = [{
                spotifyUri: 'spotify:track:091n9MH1VUepOdhnv7SLci',
                spotifyId: '091n9MH1VUepOdhnv7SLci',
                artistNames: ['Denzel Curry'],
                playedAt: new Date('2021-08-16T07:04:05.701Z'),
                trackName: 'The Game'
            }];

            await playedTracksModel.savePlayedTracks(userId, playedTracks);
        });
    });
});