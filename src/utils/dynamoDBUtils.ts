import { ResourceNotFoundException } from '@aws-sdk/client-dynamodb';

export { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

export function convertDateToTs(date: Date): number {
    return date.valueOf();
}

export function convertTsToDate(ts: number): Date {
    return new Date(ts);
}

// Type Guards as no support for native error types yet: https://github.com/aws/aws-sdk-js-v3/issues/2007
export function isResourceNotFoundException(err: any): err is ResourceNotFoundException {
    return err?.name === 'ResourceNotFoundException';
}