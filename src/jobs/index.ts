import { SaveTrackHistoryJob } from './save-track-history-job';
import { spotifyClient  } from '../services';
import { trackHistoryModel } from '../models';

export const saveSaveTrackHistoryJob: SaveTrackHistoryJob = new SaveTrackHistoryJob(spotifyClient, trackHistoryModel);