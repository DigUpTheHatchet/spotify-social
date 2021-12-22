Goal:
* I want to continously capture my spotify play history
* The get-recently-played endpoint on the spotify API returns the last 50 played tracks
* I will need to set up a scheduled job to call this endpoint every X minutes
* This scheduled job will need to be frequent enough so that there is no gap in the history if I happen to be playing songs for a full hour 
* It will need to deduplicate the played tracks because there will be overlap in the history (use the playedAt to dedupe?)
* Spotify access tokens need to be refreshed every hour, so the call to spotify will need to refresh and then retry itself when this happens
    I'll need to store the access token in a db instead of an env variable because we will want to save this when this happens


- Run (unit?) tests in CI/CD
- Start using dotenv for managing environment variables
- Parse ddb table specs from tf
- Create serialize/deserialize functions for dates in dynamodb: see below this file
- Implement a proper logger inplace of console.log
- Give love to the CI/CD build, e.g. add a manual approval for the terraform apply step

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


AWS_SECRET_ACCESS_KEY=local AWS_ACCESS_KEY_ID=local dynamodb-admin  
//npm install -g dynamodb-admin 
//  requires the same region and creds as the ddb client
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

    

<!-- function serialize(values, { dateProperties = [] }) {
    const overrides = {};
  
    dateProperties.forEach((prop) => {
      if (values[prop] instanceof Date) {
        overrides[prop] = values[prop].toISOString();
      }
    });
  
    return Object.assign({}, values, overrides);
  }
  
  function deserialize(values, { dateProperties = [] }) {
    if (values) {
      const overrides = {};
  
      dateProperties.forEach((field) => {
        if (values[field]) {
          overrides[field] = new Date(values[field]);
        }
      });
  
      return Object.assign({}, values, overrides);
    }
  
    return null;
  }


  function serialize(item) {
    if (item) {
      return dynamoUtil.serialize(item, { dateProperties });
    }
  
    return null;
  }
  
  function deserialize(item) {
    if (item) {
      return dynamoUtil.deserialize(_.omit(item, HASH_KEY, EXP_FIELD), { dateProperties });
    }
  
    return null;
  } -->