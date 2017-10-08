# twitch-digits-api

The REST api to support the [twitch digits app](http://digits.twitch.pub/). Front-end repo (here)[https://github.com/pBun/twitch-digits].

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
