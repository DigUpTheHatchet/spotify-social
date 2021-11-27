import { spotifyTokenStorage } from '../../../../../src/models';
import { SpotifyToken } from '../../../../ts';

describe('integration/src/models/storage/spotify-token-dynamodb-storage.ts', () => {
    describe('saveToken', () => {
        it('todo', async () => {

            const token: SpotifyToken = {
                type: 'refresh',
                // value: 'AQ4CVn6hRElju9DJD',
                value: 'AQDA093ekl5O8hic9jcXLCM4906pIeqw80qedy0-Fmp7yC5A9M6lRoX_hAF6TG2-M_UKP_3z1liZwITOuaiR_NT4YDA3WVdQkBpRyzywXjvJxlSBqg5bKCAZXMry-XWfQbU',
                userId: 'xdrk',
                scopes: ['user-read-currently-playing', 'user-read-recently-played'],
                createdAt: new Date()
            };

            await spotifyTokenStorage.saveToken(token);
        });
    });

    describe('getRefreshToken', () => {
        it('todo', async () => {
            const refreshToken = await spotifyTokenStorage.getRefreshToken('xdrk');
            console.log({refreshToken});
        });
    });
});