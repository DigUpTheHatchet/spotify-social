import { expect } from 'chai';
import sinon from 'sinon';
import { convertDateToTs, marshall, unmarshall } from '../../../utils/dynamoDBUtils';

describe('unit/src/utils/dynamodbUtils.ts', () => {
    describe('marshall', () => {
        it('should marshall objects into the expected format for persisting in DynamoDB', async () => {
            const input = {
                type: 'refresh:played-tracks',
                value: 'AQ4CVn6hRElju9DJD2Hy93cshfBFkzRplo9EY0edWYK53vbQCKtYR_AUk7oq4coZgNJDPvP3JXG1OwC98Hk5b488iVJ_vSE16poUUlh0Z-D4fTxuVKsOTbGQjS-br2xeSls',
                userId: 'userXyz',
                scopes: ['user-read-currently-playing', 'user-read-recently-played'],
                createdAt: 1635050236
            };

            const expectedOutput = {
                type: { 'S': 'refresh:played-tracks' },
                value: { 'S': 'AQ4CVn6hRElju9DJD2Hy93cshfBFkzRplo9EY0edWYK53vbQCKtYR_AUk7oq4coZgNJDPvP3JXG1OwC98Hk5b488iVJ_vSE16poUUlh0Z-D4fTxuVKsOTbGQjS-br2xeSls' },
                userId: { 'S': 'userXyz' },
                scopes: { 'L': [{ 'S': 'user-read-currently-playing' }, { 'S': 'user-read-recently-played' }] },
                createdAt: { 'N': '1635050236' }
            };

            const marshalledOutput = marshall(input);

            expect(marshalledOutput).to.eql(expectedOutput);
        });
    });

    describe('unmarshall', () => {
        it('should unmarshall items retrieved from DynamoDB', () => {
            const input = {
                'createdAt': { 'N': '1635046770' },
                'scopes': { 'SS': ['user-read-currently-playing', 'user-read-recently-played'] },
                'type': { 'S': 'refresh:played-tracks' },
                'userId': { 'S': 'userXyz' },
                'value': { 'S': 'AQ4CVn6hRElju9DJD2Hy93cshfBFkzRplo9EY0edWYK53vbQCKtYR_AUk7oq4coZgNJDPvP3JXG1OwC98Hk5b488iVJ_vSE16poUUlh0Z-D4fTxuVKsOTbGQjS-br2xeSls' }
            };

            const expectedOutput = {
                type: 'refresh:played-tracks',
                value: 'AQ4CVn6hRElju9DJD2Hy93cshfBFkzRplo9EY0edWYK53vbQCKtYR_AUk7oq4coZgNJDPvP3JXG1OwC98Hk5b488iVJ_vSE16poUUlh0Z-D4fTxuVKsOTbGQjS-br2xeSls',
                userId: 'userXyz',
                scopes: new Set(['user-read-currently-playing', 'user-read-recently-played']),
                createdAt: 1635046770
            };

            const unmarshalledOutput = unmarshall(input);

            expect(unmarshalledOutput).to.eql(expectedOutput);
        });
    });

    describe('convertDateToTs', () => {
        it('todo', () => {

        });
    });
});