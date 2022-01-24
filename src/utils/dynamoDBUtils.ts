import { ResourceNotFoundException } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import * as _ from 'lodash';
import { isNumber } from 'lodash';

export function convertDateToTs(date: Date): number {
    return date.valueOf();
}

export function convertTsToDate(ts: number): Date {
    return new Date(ts);
}

export function marshallItem(item: any, dateFields: string[]): any {
    const serializedProperties = dateFields.reduce((properties, fieldName) => {
        if (item[fieldName] instanceof Date) {
            properties[fieldName] = convertDateToTs(item[fieldName]);
        }
        return properties;
    }, {});

    const serializedItem = { ...item, ...serializedProperties };

    return marshall(serializedItem);
}

export function unmarshallItem(item: any, dateFields: string[]): any {
    const unmarshalledItem = unmarshall(item);

    if (unmarshalledItem) {
        const deserializedProperties = dateFields.reduce((properties, fieldName) => {

            if (isNumber(unmarshalledItem[fieldName])) {
                properties[fieldName] = convertTsToDate(unmarshalledItem[fieldName]);
            }
            return properties;
        }, {});

        const deserializedItem = { ...unmarshalledItem, ...deserializedProperties };

        return deserializedItem;
    }

    return unmarshalledItem;
}

// Type Guards as no support for native error types yet: https://github.com/aws/aws-sdk-js-v3/issues/2007
export function isResourceNotFoundException(err: any): err is ResourceNotFoundException {
    return err?.name === 'ResourceNotFoundException';
}