import { SavePlayedTracksJob } from './save-played-tracks-job';
import { playedTracksModel, spotifyModel } from '../models';

export const savePlayedTracksJob: SavePlayedTracksJob = new SavePlayedTracksJob(spotifyModel, playedTracksModel);