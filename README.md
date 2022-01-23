# Spotify Social (WIP)
A for-fun project that uses the [Spotify Developer API](https://developer.spotify.com/discover/), built with Typescript and deployed on AWS.

# Overview

### Motivations
The primary motivation of this project was to build something cool using the [Spotify Developer API](https://developer.spotify.com/discover/) that I could share with my friends. Listening to music is a huge part of my life: one of the best parts about being a software engineer is that I get to listen to music all day, and I have a lot of friends who do the same. The first use-case that I've implemented in this project is a scheduled job that downloads my friends' (and my own) Spotify play history. 
I will be able to do some cool analysis on this play history after I have collected enough data. I have a bunch of other ideas that I want to experiment with (see: [Future Enhancements](#future-enhancements) section).

I created a [personal website](https://www.dyl.dev) earlier this year and I wanted to build something fun that I could integrate with that site. This site will serve as a front-end for any features built in this project, and for exposing the collected data to the registered Spotify users (i.e. my friends).

Additionally, I wanted to implement and showcase some of the best-practices and codestyle that I have picked up over the past few years of writing and deploying software; so I have decided to make this repository public.

### Technologies Used:
  - [Typescript](https://www.typescriptlang.org/)
  - [DynamoDB](https://aws.amazon.com/dynamodb/)
  - [AWS Lambda](https://aws.amazon.com/lambda/)
  - [AWS API Gateway](https://aws.amazon.com/api-gateway/)
  - [Terraform](https://www.terraform.io/)
  - [Github Actions](https://docs.github.com/en/actions)
  - [Next.js](https://nextjs.org/) & [NextAuth](https://next-auth.js.org/providers/spotify) (for the [authorization flow](https://www.dyl.dev/spotify-authorize))

### Spotify Web API
Spotify have exposed a bunch of really cool information through their [Spotify Web API](https://developer.spotify.com/documentation/web-api/quick-start/). There are endpoints to search for or retrieve information about songs, artists, and playlists, as well as endpoints to retrieve user-related data (like current player status and play history). These user-related endpoints require user authentication, via [OAuth 2.0](https://developer.spotify.com/documentation/general/guides/authorization/). The full list of endpoints available can be found [here](https://developer.spotify.com/documentation/web-api/reference/#/). 

This application allows Spotify users to "register" via an OAuth authentication flow on [dyl.dev](https://www.dyl.dev/spotify-authorize), which creates (and persists in the database) an 'authentication' token and a 'refresh' token for the user. These authentication tokens expire after one hour, but the refresh token can be used to generate new authentication tokens. This application uses the (persisted) refresh token of registered users to obtain a fresh authentication token, which can then be used to access the user-related API endpoints on behalf of the user.

![Spotify Auth Flow 1](/media/screenshots/spotify-auth-flow-1.PNG?raw=true | width=100)


### Current Features:
  - Spotify users can authenticate or "register" on this application. The user's authentication and refresh tokens are then persisted in the database.
  - The play history of each registered user is periodically (i.e. every 20 minutes) retrieved from Spotify and persisted in the database, using Spotify's [/get-recently-played](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-recently-played) endpoint.

# Project Details

### Project Structure
- TODO

### Using the Spotify Web API
- TODO

### Integration with dyl.dev
- TODO

### Persistence Layer
- TODO

### Deployment
This project is currently deployed on AWS. The AWS infrastructure required is defined and managed using [Terraform](https://github.com/DigUpTheHatchet/spotify-social/tree/main/terraform). Note: see [Issue #19](https://github.com/DigUpTheHatchet/spotify-social/issues/19).

I'm using a Github Actions pipeline for CI/CD. This pipeline runs the unit and integration [tests](#testing) before each deployment to AWS.

# Testing
This project is fully unit and integration tested :) 

### Unit Tests
The unit tests for this project can be run using the following command: `npm run test:unit`. 
There are no dependencies for running the unit tests, so they can be run from anywhere. Obviously, you'll have to have first run `npm install` to install the required node dependencies.
The testing packages used are:
 - Test Runner: [Mocha](https://www.npmjs.com/package/mocha)
 - Mocks/Stubs: [Sinon](https://www.npmjs.com/package/sinon)
 - Assertions: [Chai](https://www.npmjs.com/package/chai)

### Integration Tests
There are a number of dependencies required to run the integrations tests in this project:
- An instance of [dynamodb-local](https://hub.docker.com/r/amazon/dynamodb-local) must be running on localhost port `8000`.
- A number of environment variables must be defined (as the ITs hit the actual Spotify API):
  - `SPOTIFY_CLIENT_ID` - The actual `SPOTIFY_CLIENT_ID` of my [Spotify App](https://developer.spotify.com/documentation/general/guides/authorization/app-settings/).
  - `SPOTIFY_CLIENT_SECRET` - The actual `SPOTIFY_CLIENT_SECRET` of my [Spotify App](https://developer.spotify.com/documentation/general/guides/authorization/app-settings/).
  - `SPOTIFY_REFRESH_TOKEN_ITS` - The refresh token from a Spotify account I created for running the ITs.
  - `SPOTIFY_REFRESH_TOKEN_SCOPES_ITS` - The scopes authorized on the above refresh token.

Because the required environment variables include credentials from my own Spotify App, I can't expose them here. 
If you want to run the ITs, you will need to create your own [Spotify App](https://developer.spotify.com/documentation/general/guides/authorization/app-settings/) (+ credentials) and generate a refresh token for your Spotify user.

Once the above dependencies have been met, run the ITs with `npm run test:integration`.

You can see an example of the ITs being run in the [Github Actions Pipeline](https://github.com/DigUpTheHatchet/spotify-social/tree/main/.github/workflows/terraform.yml). An instance of dynamodb-local is started as a Service on port `8000`, and the required environment variables are passed to the `Run integration tests` step.

Before each integration test, a `prepareTestTables()` function is called. This function will destroy and re-create all dynamodb tables, before inserting any test data that is required for the IT. You can see an example of this [here](https://github.com/DigUpTheHatchet/spotify-social/tree/main/test/integration/src/models/played-tracks-model.test.ts#L26).

# Future Enhancements
- TODO

# Contribution
This project is not currently open to contributions, but it is something I'm open to.. so get in touch :)

# Licensing
Please review the [License](LICENSE.md), then proceed to go wild! 