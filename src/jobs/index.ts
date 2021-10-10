import { SaveTrackHistoryJob } from './save-track-history-job';
import { spotifyClient  } from '../services';
import { trackHistoryModel } from '../models/track-history-model';

export const saveSaveTrackHistoryJob: SaveTrackHistoryJob = new SaveTrackHistoryJob(spotifyClient, trackHistoryModel);