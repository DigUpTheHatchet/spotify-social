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
  - [Next.js](https://nextjs.org/) & [NextAuth](https://next-auth.js.org/providers/spotify) (for the [dyl.dev](https://www.dyl.dev) integration)

### Spotify Web API:
Spotify have exposed a bunch of really cool information through their [Spotify Web API](https://developer.spotify.com/documentation/web-api/quick-start/). There are endpoints to search for or retrieve information about songs, artists, and playlists, as well as endpoints to retrieve user-related data (like current player status and play history). These user-related endpoints require user authentication, via [OAuth 2.0](https://developer.spotify.com/documentation/general/guides/authorization/). The full list of endpoints available can be found [here](https://developer.spotify.com/documentation/web-api/reference/#/). 

This application allows Spotify users to "register" via an OAuth authentication flow on [dyl.dev](https://www.dyl.dev/spotify-authorize), which creates (and persists in the database) an 'authentication' token and a 'refresh' token for the Spotify user. These authentication tokens expire after one hour, but the refresh token can be used to generate new authentication tokens. This application uses the (persisted) refresh token of registered users to obtain a fresh authentication token, which can then be used to access the user-related API endpoints on behalf of the user.

### Current Features:
  - Spotify users can authenticate or "register" on this application. Authentication and refresh tokens are persisted.
  - The play history of each registered user is retrieved from Spotify and persisted in the database (every 20 minutes), using Spotify's [/get-recently-played](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-recently-played) endpoint.

# Project Details
- Overview of the project structure/directories
- Using the Spotify Web API
- Integration with dyl.dev
- Model/Storage design choices and DynamoDB access patterns 
- Deployment:
  - Terraform
  - Github Actions
  - AWS

# Testing
- Unit tests
- Integration tests:
  - DynamoDB Local
  - Spotify Account for ITs

# Future Enhancements
- TODO

# Contribution
This project is not currently open to contributions, but it is something I'm open to.. so get in touch :)

# Licensing
Please review the [License](LICENSE.md), then proceed to go wild! 