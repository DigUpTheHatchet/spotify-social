import { spotifyTokenStorage } from '../../../../../src/models';
import { SpotifyToken } from '../../../../ts';

describe('integration/src/models/storage/spotify-token-dynamodb-storage.ts', () => {
    describe('saveToken', () => {
        it('todo', async () => {

            const token: SpotifyToken = {
                type: 'refresh:played-tracks',
                value: 'AQ4CVn6hRElju9DJD2Hy93cshfBFkzRplo9EY0edWYK53vbQCKtYR_AUk7oq4coZgNJDPvP3JXG1OwC98Hk5b488iVJ_vSE16poUUlh0Z-D4fTxuVKsOTbGQjS-br2xeSls',
                userId: 'userXyz',
                scopes: ['user-read-currently-playing', 'user-read-recently-played'],
                createdAt: new Date()
            };

            await spotifyTokenStorage.saveToken(token.userId, token);
        });
    });

    describe('getRefreshToken', () => {
        it('todo', async () => {
            const refreshToken = await spotifyTokenStorage.getRefreshToken('userXyz');
            console.log({refreshToken});
        });
    });
});