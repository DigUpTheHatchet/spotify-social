Goal:
* I want to continously capture my spotify play history
* The get-recently-played endpoint on the spotify API returns the last 50 played tracks
* I will need to set up a scheduled job to call this endpoint every X minutes
* This scheduled job will need to be frequent enough so that there is no gap in the history if I happen to be playing songs for a full hour 
* It will need to deduplicate the played tracks because there will be overlap in the history (use the playedAt to dedupe?)
* Spotify access tokens need to be refreshed every hour, so the call to spotify will need to refresh and then retry itself when this happens
    I'll need to store the access token in a db instead of an env variable because we will want to save this when this happens

- Parse ddb table specs from tf
- Handle partial failures for SPT lambda, e.g. if one person revokes their token
- Create startup script for dynamodb-local for ITs
- Create serialize/deserialize functions for dates in dynamodb: see below this file
- Implement a logging library inplace of console.log
- Give love to the CI/CD build, e.g. add a manual approval for the terraform apply step
- Deploy the API gateway + CW Role for Register Spotify User with Terraform
- Upgrade/style the `/spotify` endpoint
- Encrypt payload for RSU lambda
- Create a dev environment on AWS
- Create diagrams, README.md



- TF Resource
    * Dynamodb tables
    * Lambda Function
    * Lambda Fn role:
        - DDb Get/Write access
        - 
    * Env Vars:
        - SPOTIFY_CLIENT_ID
        - SPOTIFY_CLIENT_SECRET
        - SPOTIFY_REFRESH_TOKEN_ITS
        - SPOTIFY_REFRESH_TOKEN_SCOPES_ITS


AWS_SECRET_ACCESS_KEY=local AWS_ACCESS_KEY_ID=local dynamodb-admin  
//npm install -g dynamodb-admin 
//  requires the same region and creds as the ddb client
docker run -p 8000:8000 amazon/dynamodb-local

Tables:

PlayedTracks
    hashKey: userId: string
    rangeKey: playedAt: number (secs/ epoch)

SpotifyTokens
    hashKey: userId: string  e.g. 'xdrk'
    rangeKey: type: string  e.g. 'refresh' 
    

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