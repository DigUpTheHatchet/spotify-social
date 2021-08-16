import rax from 'retry-axios';
import axios, { AxiosInstance } from 'axios';
import SpotifyClient from './spotify-client';

const axiosInstance: AxiosInstance = getAxiosInstance();
export const spotifyClient: SpotifyClient = new SpotifyClient(axiosInstance);

function getAxiosInstance() {
    const axiosInstance: AxiosInstance = axios.create();

    axiosInstance.defaults.raxConfig = {
        instance: axiosInstance,
        backoffType: 'exponential',
        statusCodesToRetry: [[100, 199], [429, 429], [500, 599]],
        retryDelay: 1500, // ms value of first delay
        retry: 4
    };

    rax.attach(axiosInstance);

    return axiosInstance;
}