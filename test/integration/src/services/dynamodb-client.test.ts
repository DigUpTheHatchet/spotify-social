import { dynamoDBClient } from '../../../../src/services';

describe('integration/src/services/dynamodb-client.ts', () => {
    describe.only('todo', () => {
        it('', () => {
            return dynamoDBClient.getItem('TestTable', 'abc')
                .then(response => console.log(response));
        });
    });
});