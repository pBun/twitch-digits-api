TWITCH_API = 'https://api.twitch.tv/kraken';
TWITCH_CLIENT_ID = '7vbwgc035rp1d3n5m9w3v5irl88s9b';

module.exports = {
    host: TWITCH_API,
    clientId: TWITCH_CLIENT_ID,
    defaultHeaders: {
        'Accept': 'application/vnd.twitchtv.v5+json',
        'Client-ID': TWITCH_CLIENT_ID
    }
};
