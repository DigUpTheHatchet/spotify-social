import { PlayedTrack, SpotifyToken, SpotifyUser, SpotifyUserData } from '../ts';
import { uniqueId } from 'lodash';

export function buildPlayedTrack(overrides?: any): PlayedTrack {
    return Object.assign({
        spotifyUri: 'spotify:track:091n9MH1VUepOdhnv7SLci',
        spotifyId: '091n9MH1VUepOdhnv7SLci',
        trackName: 'Who dunnit?',
        playedAt: new Date(),
        artistNames: ['Scooby Doo', 'Shaggy'],
        userId: 'bob'
    }, overrides);
}

export function buildSpotifyToken(overrides?: any): SpotifyToken {
    return Object.assign({
        type: 'refresh',
        value: uniqueId(),
        userId: 'rickJames',
        scopes: ['user-do-something', 'user-do-something-else'],
        createdAt: new Date()
    }, overrides);
}

export function buildSpotifyUser(overrides?: any): SpotifyUser {
    return Object.assign({
        userId: 'bubbles',
        email: 'bub1@gmail.com',
        name: 'Michael Longbottom',
        registeredAt: new Date('2021-08-16T07:04:05.701Z'),
        isEnabled: true
    }, overrides);
}

export function buildSpotifyUserData(overrides?: any): SpotifyUserData {
    return Object.assign({
        userId: 'wheelbarrow',
        email: 'wb1997@hotmail.com',
        name: 'Michael Longbottom',
        registeredAt: new Date('2021-01-01T00:00:00.000Z'),
        scopes: ['user-modify-playback-state', 'user-read-currently-playing', 'user-read-email', 'user-read-recently-played', 'user-read-private'],
        refreshToken: uniqueId(),
    }, overrides);
}

export const recentlyPlayedItems = [{
    track: {
        album: {
            album_type: 'single',
            artists: [{
                external_urls: {
                    spotify: 'https://open.spotify.com/artist/6fxyWrfmjcbj5d12gXeiNV'
                },
                href: 'https://api.spotify.com/v1/artists/6fxyWrfmjcbj5d12gXeiNV',
                id: '6fxyWrfmjcbj5d12gXeiNV',
                name: 'Denzel Curry',
                type: 'artist',
                uri: 'spotify:artist:6fxyWrfmjcbj5d12gXeiNV'
            }],
            available_markets: [
              'AD', 'AE', 'AG', 'AL', 'AM', 'AO', 'AR', 'AT', 'AU', 'AZ',
              'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BN',
              'BO', 'BR', 'BS', 'BT', 'BW', 'BY', 'BZ', 'CA', 'CH', 'CI',
              'CL', 'CM', 'CO', 'CR', 'CV', 'CW', 'CY', 'CZ', 'DE', 'DJ',
              'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'ES', 'FI', 'FJ',
              'FM', 'FR', 'GA', 'GB', 'GD', 'GE', 'GH', 'GM', 'GN', 'GQ',
              'GR', 'GT', 'GW', 'GY', 'HK', 'HN', 'HR', 'HT', 'HU', 'ID',
              'IE', 'IL', 'IN', 'IS', 'IT', 'JM', 'JO', 'JP', 'KE', 'KG',
              'KH', 'KI', 'KM', 'KN', 'KR', 'KW', 'KZ', 'LA', 'LB', 'LC',
              'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'MA', 'MC', 'MD'
            ],
            external_urls: {
              spotify: 'https://open.spotify.com/album/26tRs1uVatxA2XXvsavBcW'
            },
            href: 'https://api.spotify.com/v1/albums/26tRs1uVatxA2XXvsavBcW',
            id: '26tRs1uVatxA2XXvsavBcW',
            images: [{
                height: 640,
                url: 'https://i.scdn.co/image/ab67616d0000b273aee0f00e9679c330aa9e8714',
                width: 640
            }, {
                height: 300,
                url: 'https://i.scdn.co/image/ab67616d00001e02aee0f00e9679c330aa9e8714',
                width: 300
            }, {
                height: 64,
                url: 'https://i.scdn.co/image/ab67616d00004851aee0f00e9679c330aa9e8714',
                width: 64
            }],
            name: 'The Game',
            release_date: '2021-08-13',
            release_date_precision: 'day',
            total_tracks: 1,
            type: 'album',
            uri: 'spotify:album:26tRs1uVatxA2XXvsavBcW'
        },
        artists: [{
            external_urls: {
                spotify: 'https://open.spotify.com/artist/6fxyWrfmjcbj5d12gXeiNV'
            },
            href: 'https://api.spotify.com/v1/artists/6fxyWrfmjcbj5d12gXeiNV',
            id: '6fxyWrfmjcbj5d12gXeiNV',
            name: 'Denzel Curry',
            type: 'artist',
            uri: 'spotify:artist:6fxyWrfmjcbj5d12gXeiNV'
        }],
        available_markets: [
            'AD', 'AE', 'AG', 'AL', 'AM', 'AO', 'AR', 'AT', 'AU', 'AZ',
            'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BN',
            'BO', 'BR', 'BS', 'BT', 'BW', 'BY', 'BZ', 'CA', 'CH', 'CI',
            'CL', 'CM', 'CO', 'CR', 'CV', 'CW', 'CY', 'CZ', 'DE', 'DJ',
            'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'ES', 'FI', 'FJ',
            'FM', 'FR', 'GA', 'GB', 'GD', 'GE', 'GH', 'GM', 'GN', 'GQ',
            'GR', 'GT', 'GW', 'GY', 'HK', 'HN', 'HR', 'HT', 'HU', 'ID',
            'IE', 'IL', 'IN', 'IS', 'IT', 'JM', 'JO', 'JP', 'KE', 'KG',
            'KH', 'KI', 'KM', 'KN', 'KR', 'KW', 'KZ', 'LA', 'LB', 'LC',
            'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'MA', 'MC', 'MD'
        ],
        disc_number: 1,
        duration_ms: 164938,
        explicit: true,
        external_ids: {
            isrc: 'USC4R2004379'
        },
        external_urls: {
            spotify: 'https://open.spotify.com/track/091n9MH1VUepOdhnv7SLci'
        },
        href: 'https://api.spotify.com/v1/tracks/091n9MH1VUepOdhnv7SLci',
        id: '091n9MH1VUepOdhnv7SLci',
        is_local: false,
        name: 'The Game',
        popularity: 57,
        preview_url: 'https://p.scdn.co/mp3-preview/3cf8a8a258a5fe9b43b4b16f1b110720fd76064d?cid=39ebc040a39d46cfb25525dd5c3329b4',
        track_number: 1,
        type: 'track',
        uri: 'spotify:track:091n9MH1VUepOdhnv7SLci'
    },
    played_at: '2021-08-16T07:04:05.701Z',
    context: {
        external_urls: {
            spotify: 'https://open.spotify.com/album/26tRs1uVatxA2XXvsavBcW'
        },
        href: 'https://api.spotify.com/v1/albums/26tRs1uVatxA2XXvsavBcW',
        type: 'album',
        uri: 'spotify:album:26tRs1uVatxA2XXvsavBcW'
    }
}];