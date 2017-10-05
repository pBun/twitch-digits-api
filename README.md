# twitch-digits

A rework of the [original twitch digits app](https://github.com/pBun/twitch-digits-old) that I made over 2 years ago. The old one is still currently hosted at [http://digits.twitch.pub/](http://digits.twitch.pub/), this will eventually replace it.

## Local development

You'll need [node](http://nodejs.org/download/) and [postgresql](https://www.postgresql.org/download/).

Install your local deps with `npm install`, create your postgresql tables with `./initDb`, and you should be set.

#### Go go go.

Populate your local database with:
```
npm run snapshot
```

Build, serve, and watch:
```
npm run dev
```

Source files in `public_src` compile to `public`.
