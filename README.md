Goal:
* I want to continously capture my spotify play history
* The get-recently-played endpoint on the spotify API returns the last 50 played tracks
* I will need to set up a scheduled job to call this endpoint every X minutes
* This scheduled job will need to be frequent enough so that there is no gap in the history if I happen to be playing songs for a full hour 
* It will need to deduplicate the played tracks because there will be overlap in the history (use the playedAt to dedupe?)
* Spotify access tokens need to be refreshed every hour, so the call to spotify will need to refresh and then retry itself when this happens
    I'll need to store the access token in a db instead of an env variable because we will want to save this when this happens



- Start using dotenv for managing environment variables
- Create table definitions to start with, and scripts to setup/reset tables (e.g. for ITs)

- TF Resource
    * Dynamodb tables
    * Lambda Function
    * Lambda Fn role:
        - DDb Get/Write access
        - 
    * Env Vars:
        - NODE_ENV
        - SPOTIFY_CLIENT_ID
        - SPOTIFY_CLIENT_SECRET
        - DYNAMODB_ENDPOINT
        - AWS_REGION


dynamodb-admin  //npm install -g dynamodb-admin 
docker run -p 8000:8000 amazon/dynamodb-local

Tables:

PlayedTracks
    hashKey: userId: string
    rangeKey: playedAt: number (secs/ epoch)

    userId
    playedAt
    spotifyUri
    spotifyId
    trackName
    artistNames


getLastPlayedTrack(userId: string)
    query(key={userId}, ScanIndexForward=True, limit=1)
    
saveTracks(userId: string, tracks: PlayedTrack[])

getTrackHistory(userId: string, startDate: Date, endDate: Date)



SpotifyTokens
    hashKey: userId: string  e.g. 'xdrk'
    rangeKey: type: string  e.g. 'refresh' 
    
    userId
    type
    scopes
    createdAt

    getRefreshToken()
    saveToken()

    