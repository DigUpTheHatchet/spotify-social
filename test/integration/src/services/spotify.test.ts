import { expect } from 'chai';
import sinon from 'sinon';

import { spotifyClient } from '../../../../src/services';

describe('integration/src/services/SpotifyClient.ts', () => {
    describe('todo', () => {
        it('', () => {
            return spotifyClient.getRecentlyPlayedTracks()
                .then(response => console.log(response));
        });
    });
});