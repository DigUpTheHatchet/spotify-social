Goal:
* I want to continously capture my spotify play history
* The get-recently-played endpoint on the spotify API returns the last 50 played tracks
* I will need to set up a scheduled job to call this endpoint every X minutes
* This scheduled job will need to be frequent enough so that there is no gap in the history if I happen to be playing songs for a full hour 
* It will need to deduplicate the played tracks because there will be overlap in the history (use the playedAt to dedupe?)
* Spotify access tokens need to be refreshed every hour, so the call to spotify will need to refresh and then retry itself when this happens
    I'll need to store the access token in a db instead of an env variable because we will want to save this when this happens



- Start using dotenv for managing environment variables
x Get dynamodb local running 
- Create basic crud operations in TrackHistoryDynamoDBStorage
- Create table definitions to start with 
- Parameterise all functions by userId



npm install -g dynamodb-admin 
docker run -p 8000:8000 amazon/dynamodb-local

Tables:

TrackHistory
    hashKey: userId
    rangeKey: playedAt


getLastPlayedTrack(userId: string)
    query(key={userId}, ScanIndexForward=True, limit=1)
    
saveTracks(userId: string, tracks: PlayedTrack[])

getTrackHistory(userId: string, startDate: Date, endDate: Date)



SpotifyTokens
    hashKey: userId
    