import * as _ from 'lodash';
import rax from 'retry-axios';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export class HttpClient {
    protected axiosInstance: AxiosInstance;

    constructor() {
        const axiosInstance: AxiosInstance = axios.create();

        axiosInstance.defaults.raxConfig = {
            instance: axiosInstance,
            backoffType: 'exponential',
            statusCodesToRetry: [[100, 199], [429, 429], [500, 599]],
            retryDelay: 1500, // ms value of first delay
            retry: 4
        };

        rax.attach(axiosInstance);
        this.axiosInstance = axiosInstance;
    }

    async get(url: string, options?: AxiosRequestConfig) {
        const response = await this.axiosInstance.get(url, options);
        console.log({data: response.data});
        return response['data'];
    }

    async post(url: string, body?: string, options?: AxiosRequestConfig) {
        const response = await this.axiosInstance.post(url, body, options);
        return response['data'];
    }
}