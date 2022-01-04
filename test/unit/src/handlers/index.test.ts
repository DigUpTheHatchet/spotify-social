import { expect } from 'chai';
import sinon from 'sinon';
import { savePlayedTracksJob } from '../../../../src/jobs';
import { savePlayedTracksJobHandler, registerSpotifyUserHandler } from '../../../../src/handlers';
import { spotifyModel } from '../../../../src/models';

describe('unit/src/handlers/index.ts', () => {
    describe('savePlayedTracksJobHandler', () => {

        beforeEach(() => {
            sinon.stub(savePlayedTracksJob, 'run').resolves();
        });

        afterEach(() => {
            (savePlayedTracksJob.run as sinon.SinonStub).restore();
        });

        it('should run the savePlayedTracksJob', async () => {
            await savePlayedTracksJobHandler({}, {});

            expect(savePlayedTracksJob.run).to.have.been.calledOnce();
        });
    });

    describe('registerSpotifyUserHandler', () => {
        const mockEvent = {
            userId: '23290393111',
            name: 'Oliver Twist',
            email: 'olivertwist@gmail.com',
            refreshToken: '98472930848923748923749023-u49kjeshpfkjsdhfksdhfpdsf24r23riohfkphfkpsphfkhsdf',
            scopes: 'some-scope-1 some-other-scope-2'
        };

        beforeEach(() => {
            sinon.stub(spotifyModel, 'registerUser').resolves();
        });

        afterEach(() => {
            (spotifyModel.registerUser as sinon.SinonStub).restore();
        });

        it('should parse the spotify user data and register the user', async () => {
            const expectedScopes = ['some-scope-1', 'some-other-scope-2'];

            await registerSpotifyUserHandler(mockEvent, {});

            expect(spotifyModel.registerUser).to.have.been.called.calledOnce();

            expect((spotifyModel.registerUser as sinon.SinonStub).getCall(0).args[0]['userId']).to.eql(mockEvent.userId);
            expect((spotifyModel.registerUser as sinon.SinonStub).getCall(0).args[0]['name']).to.eql(mockEvent.name);
            expect((spotifyModel.registerUser as sinon.SinonStub).getCall(0).args[0]['email']).to.eql(mockEvent.email);
            expect((spotifyModel.registerUser as sinon.SinonStub).getCall(0).args[0]['refreshToken']).to.eql(mockEvent.refreshToken);
            expect((spotifyModel.registerUser as sinon.SinonStub).getCall(0).args[0]['scopes']).to.eql(expectedScopes);
            expect((spotifyModel.registerUser as sinon.SinonStub).getCall(0).args[0]['registeredAt']).to.be.an.instanceof(Date);
        });
    });
});