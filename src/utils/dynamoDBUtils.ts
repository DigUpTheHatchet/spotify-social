export { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

export function convertDateToTs(date: Date): number {
    return Math.floor(date.valueOf() / 1000);
}