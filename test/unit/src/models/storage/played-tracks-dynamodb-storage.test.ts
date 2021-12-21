// import { expect } from 'chai';
// import { stubInterface } from 'ts-sinon';
// import sinon from 'sinon';

// import { DynamoDBClient, PlayedTrack } from '../../../../ts';
// import { PlayedTracksDynamoDBStorage } from '../../../../models/storage/played-tracks-dynamodb-storage2';
// import { buildPlayedTrack } from '../../../../fixtures';

// const tableName = 'PlayedTracks';
// const mockDynamoDBClient = stubInterface<DynamoDBClient>();
// const playedTracksDynamoDBStorage: PlayedTracksDynamoDBStorage = new PlayedTracksDynamoDBStorage(mockDynamoDBClient, tableName);

// describe.only('unit/src/models/storage/played-tracks-dynamodb-storage.ts', () => {
//     const userId = 'brian123';

//     describe('getLastSavedPlayedTrack', async () => {
//         const expectedLastSavedPlayedTrack: PlayedTrack = buildPlayedTrack({ userId });

//         beforeEach(() => {
//             mockDynamoDBClient.query.resolves(expectedLastPlayedTrack);
//         });

//         afterEach(() => {
//             mockDynamoDBClient.query.reset();
//         });

//         it.only('should construct & execute the DynamoDB query for the user\'s last saved track', async () => {
//             const retrievedTrack: PlayedTrack = await playedTracksDynamoDBStorage.getLastSavedPlayedTrack(userId);

//             expect(retrievedTrack).to.eql(expectedLastSavedPlayedTrack);
//             expect(mockDynamoDBClient).to.have.been.calledOnceWithExactly();
//         });
//     });

//     describe('savePlayedTracks', () => {

//         it('todo', async () => {

//         });
//     });

//     describe('getPlayedTracks', () => {

//         it('todo', async () => {

//         });
//     });
// });