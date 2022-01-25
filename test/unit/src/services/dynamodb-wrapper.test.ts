import { expect } from 'chai';
import sinon from 'sinon';
import { stubInterface } from 'ts-sinon';
import * as _ from 'lodash';

import { CreateTableInput, DynamoDB, GetItemInput, QueryInput, ScanInput } from '@aws-sdk/client-dynamodb';

import DynamoDBWrapper from '../../../../src/services/dynamodb-wrapper';

const mockDbClient = stubInterface<DynamoDB>();
const dynamoDBWrapper = new DynamoDBWrapper(mockDbClient);

const mockTableName = 'tabularised';

describe('unit/src/services/dynamodb-wrapper.ts', () => {
    describe('getItem', () => {
        const mockParams: GetItemInput = {
            'TableName': 'SpotifyUsers',
            'Key': {'userId': {'S': 'rickygervais'}}
        };
        const mockGetItemReturn = {
            '$metadata': {'httpStatusCode': 200, 'requestId': 'a7591dbd-f282-4f33-aa97-14ac9af8b61d', 'attempts': 1, 'totalRetryDelay': 0},
            'Item': {'name': {'S': 'Michael Longbottom'}, 'registeredAt': {'N': '1609459200000'},
            'userId': {'S': 'rickygervais'}, 'email': {'S': 'wb1997@hotmail.com'}, 'isEnabled': {'BOOL': true}}
        };

        beforeEach(() => {
            mockDbClient.getItem.resolves(mockGetItemReturn);
        });

        afterEach(() => {
            mockDbClient.getItem.reset();
        });

        it('should call getItem on the ddb client and unmarshall the result', async () => {
            const expectedItem = {
                name: 'Michael Longbottom',
                registeredAt: 1609459200000,
                userId: 'rickygervais',
                email: 'wb1997@hotmail.com',
                isEnabled: true
            };

            const item = await dynamoDBWrapper.getItem(mockParams);

            expect(item).to.eql(expectedItem);

            expect(mockDbClient.getItem).to.have.been.calledOnceWithExactly(mockParams);
        });
    });

    describe('putItem', () => {
        const mockItem = {
            'userId': 'bobgeldof', 'email': 'wb1997@hotmail.com', 'name': 'Michael Longbottom', 'registeredAt': 1609459200000, 'isEnabled': true
        };
        const mockPutItemReturn = {
            'TableName': 'SpotifyUsers', 'Item': {'userId': {'S': 'bobgeldof'}, 'email': {'S': 'wb1997@hotmail.com'},
            'name': {'S': 'Michael Longbottom'}, 'registeredAt': {'N': '1609459200000'}, 'isEnabled': {'BOOL': true}}
        };

        beforeEach(() => {
            mockDbClient.putItem.resolves(mockPutItemReturn);
        });

        afterEach(() => {
            mockDbClient.putItem.reset();
        });

        it('should marshall the item and call putItem on the ddb client', async () => {
            const expectedPutItemInput =   {
                TableName: 'tabularised',
                Item: {
                    userId: { S: 'bobgeldof' },
                    email: { S: 'wb1997@hotmail.com' },
                    name: { S: 'Michael Longbottom' },
                    registeredAt: { N: '1609459200000' },
                    isEnabled: { BOOL: true }
                }
            };

            await dynamoDBWrapper.putItem(mockTableName, mockItem);

            expect(mockDbClient.putItem).to.have.been.calledOnceWithExactly(expectedPutItemInput);
        });
    });

    describe('scan', () => {
        const mockParams: ScanInput = { TableName: mockTableName };
        const mockScanReturn = {
            '$metadata': {'httpStatusCode': 200, 'requestId': '8b26d99c-7ec0-4101-9a60-fecf4d2856ad', 'attempts': 1, 'totalRetryDelay': 0}, 'Count': 3,
            'Items': [{'name': {'S': 'Michael Longbottom'}, 'registeredAt': {'N': '1629097445701'},
            'userId': {'S': 'blue'}, 'email': {'S': 'blue@1.com'}, 'isEnabled': {'BOOL': false}}], 'ScannedCount': 3
        };

        beforeEach(() => {
            mockDbClient.scan.resolves(mockScanReturn);
        });

        afterEach(() => {
            mockDbClient.scan.reset();
        });

        it('should call scan on the ddb client and unmarshall the result', async () => {
            const expectedItems = [{
                  name: 'Michael Longbottom',
                  registeredAt: 1629097445701,
                  userId: 'blue',
                  email: 'blue@1.com',
                  isEnabled: false
            }];

            const items = await dynamoDBWrapper.scan(mockParams);

            expect(items).to.eql(expectedItems);

            expect(mockDbClient.scan).to.have.been.calledOnceWithExactly(mockParams);
        });
    });

    describe('query', () => {
        const mockParams: QueryInput = {
            'TableName': 'PlayedTracks',
            'ScanIndexForward': false,
            'Limit': 1,
            'KeyConditionExpression': 'userId = :v_pk',
            'ExpressionAttributeValues': {':v_pk': {'S': 'spidey100'}}
        };

        const mockQueryReturn = {
            '$metadata': {'httpStatusCode': 200, 'requestId': '0ff62273-b55c-4c4d-b1b1-b6edc4d2d950', 'attempts': 1, 'totalRetryDelay': 0}, 'Count': 1,
            'Items': [{'artistNames': {'L': [{'S': 'Scooby Doo'}, {'S': 'Shaggy'}]}, 'spotifyId': {'S': '091n9MH1VUepOdhnv7SLci'}, 'trackName': {'S': 'xyz'},
            'spotifyUri': {'S': 'spotify:track:091n9MH1VUepOdhnv7SLci'}, 'playedAt': {'N': '1640934000000'}, 'userId': {'S': 'spidey100'}}],
            'LastEvaluatedKey': {'playedAt': {'N': '1640934000000'}, 'userId': {'S': 'spidey100'}}, 'ScannedCount': 1
        };

        beforeEach(() => {
            mockDbClient.query.resolves(mockQueryReturn);
        });

        afterEach(() => {
            mockDbClient.query.reset();
        });

        it('should call query on the ddb client and unmarshall the result', async () => {
            const expectedItems = [{
                artistNames: ['Scooby Doo', 'Shaggy'],
                spotifyId: '091n9MH1VUepOdhnv7SLci',
                trackName: 'xyz',
                spotifyUri: 'spotify:track:091n9MH1VUepOdhnv7SLci',
                playedAt: 1640934000000,
                userId: 'spidey100'
            }];

            const items = await dynamoDBWrapper.query(mockParams);

            expect(items).to.eql(expectedItems);

            expect(mockDbClient.query).to.have.been.calledOnceWithExactly(mockParams);
        });
    });

    describe('batchWriteItems', () => {
        const mockItem = {
            'spotifyUri': 'spotify:track:091n9MH1VUepOdhnv7SLci', 'spotifyId': '091n9MH1VUepOdhnv7SLci',
            'trackName': 'Who dunnit?', 'playedAt': new Date(1643086257030), 'artistNames': ['Scooby Doo', 'Shaggy'], 'userId': 'frank'
        };
        const mockItems = _.range(0, 30).map(i => mockItem);
        const dateFields = ['playedAt'];

        beforeEach(() => {
            sinon.stub(dynamoDBWrapper, '_batchWriteItem').resolves();
        });

        afterEach(() => {
            (dynamoDBWrapper._batchWriteItem as sinon.SinonStub).restore();
        });

        it('should call marshall and chunks the items, then call _batchWriteItem for each 25 item chunk', async () => {
            const marshalledItem = {
                'PutRequest': {'Item': {'spotifyUri': {'S': 'spotify:track:091n9MH1VUepOdhnv7SLci'}, 'spotifyId': {'S': '091n9MH1VUepOdhnv7SLci'},
                'trackName': {'S': 'Who dunnit?'}, 'playedAt': {'N': '1643086257030'}, 'artistNames': {'L': [{'S': 'Scooby Doo'}, {'S': 'Shaggy'}]}, 'userId': {'S': 'frank'}}}
            };
            const expectedChunks = [_.range(0, 25).map(i => marshalledItem), _.range(0, 5).map(i => marshalledItem)];

            await dynamoDBWrapper.batchWriteItems(mockTableName, mockItems, dateFields);

            expect(dynamoDBWrapper._batchWriteItem).to.have.been.calledTwice();

            expect((dynamoDBWrapper._batchWriteItem as sinon.SinonStub).getCall(0).args[0]).to.eql(mockTableName);
            expect((dynamoDBWrapper._batchWriteItem as sinon.SinonStub).getCall(0).args[1]).to.eql(expectedChunks[0]);

            expect((dynamoDBWrapper._batchWriteItem as sinon.SinonStub).getCall(1).args[0]).to.eql(mockTableName);
            expect((dynamoDBWrapper._batchWriteItem as sinon.SinonStub).getCall(1).args[1]).to.eql(expectedChunks[1]);
        });
    });

    describe('_batchWriteItem', () => {
        const marshalledItem = {
            'PutRequest': {'Item': {'spotifyUri': {'S': 'spotify:track:091n9MH1VUepOdhnv7SLci'}, 'spotifyId': {'S': '091n9MH1VUepOdhnv7SLci'},
            'trackName': {'S': 'Who dunnit?'}, 'playedAt': {'N': '1637370000000'}, 'artistNames': {'L': [{'S': 'Scooby Doo'}, {'S': 'Shaggy'}]}, 'userId': {'S': 'frank'}}}
        };

        const mockChunk = _.range(0, 15).map(i => marshalledItem);

        beforeEach(() => {
            mockDbClient.batchWriteItem.resolves();
        });

        afterEach(() => {
            mockDbClient.batchWriteItem.reset();
        });

        it('should call batchWriteItem on the ddb client', async () => {
            const expectedParams = { RequestItems: { [mockTableName]: mockChunk }};

            await dynamoDBWrapper._batchWriteItem(mockTableName, mockChunk);

            expect(mockDbClient.batchWriteItem).to.have.been.calledOnceWithExactly(expectedParams);
        });
    });

    describe('createTable', () => {
        const mockParams: CreateTableInput = {
            'TableName': 'SpotifyUsers', 'AttributeDefinitions': [{'AttributeName': 'userId', 'AttributeType': 'S'}],
            'KeySchema': [{'AttributeName': 'userId', 'KeyType': 'HASH'}],
            'ProvisionedThroughput': {'ReadCapacityUnits': 3, 'WriteCapacityUnits': 3}
        };

        beforeEach(() => {
            mockDbClient.createTable.resolves();
        });

        afterEach(() => {
            mockDbClient.createTable.reset();
        });

        it('should call createTable on the ddb client', async () => {
            await dynamoDBWrapper.createTable(mockParams);

            expect(mockDbClient.createTable).to.have.been.calledOnceWithExactly(mockParams);
        });
    });

    describe('deleteTable', () => {
        const expectedParams = { TableName: mockTableName };

        afterEach(() => {
            mockDbClient.deleteTable.reset();
        });

        it('should call delete table on the ddb client', async () => {
            mockDbClient.deleteTable.resolves();

            await dynamoDBWrapper.deleteTable(mockTableName);

            expect(mockDbClient.deleteTable).to.have.been.calledOnceWithExactly(expectedParams);
        });

        it('should catch and handle ResourceNotFound exceptions', async () => {
            const resourceNotFoundErr = new Error('message1');
            resourceNotFoundErr.name = 'ResourceNotFoundException';
            mockDbClient.deleteTable.rejects(resourceNotFoundErr);

            await dynamoDBWrapper.deleteTable(mockTableName);

            expect(mockDbClient.deleteTable).to.have.been.calledOnceWithExactly(expectedParams);
        });

        it('should not catch any non-ResourceNotFound exceptions', async () => {
            const resourceNotFoundErr = new Error('message2');
            resourceNotFoundErr.name = 'SomeOtherErrType';
            mockDbClient.deleteTable.rejects(resourceNotFoundErr);

            return dynamoDBWrapper.deleteTable(mockTableName)
                .then(() => expect.fail())
                .catch(err => {
                    expect(`${err.name}`).to.eql('SomeOtherErrType');
                    expect(`${err.message}`).to.eql('message2');
                })
                .then(() => expect(mockDbClient.deleteTable).to.have.been.calledOnceWithExactly(expectedParams));
        });
    });
});