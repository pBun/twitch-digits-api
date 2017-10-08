var { query } = require('../../models/db');
var twitch = require('../../models/twitch');

var SummarySnapshot = require('../../models/Snapshot/SummarySnapshot');
var Game = require('../../models/Game');
var GameSnapshot = require('../../models/Snapshot/GameSnapshot');
var Channel = require('../../models/Channel');
var ChannelSnapshot = require('../../models/Snapshot/ChannelSnapshot');

var Snapshot = function(time) {
    this.gameLimit = 50;
    this.streamLimit = 10;
    this.sigCutoff = 0.001
    this.time = time || new Date();
    this.summary = new SummarySnapshot(this.time);
    this.gameSnapshots = [];
    this.games = [];
    this.channelSnapshots = [];
    this.channels = [];
};

Snapshot.prototype.getChannelSnapshotsFromTwitch = function() {
    return new Promise((resolve, reject) => {
        var promises = [];
        this.channelSnapshots = [];
        this.channels = [];
        this.games.forEach(g => {
            var p = twitch.streams({ game: g.name, limit: this.streamLimit }).then((res) => {
                var filtered = res.filter(s => {
                    var mg = this.gameSnapshots.filter(gs => g._id === gs.game_id);
                    var gViewers = mg.length ? mg[0].viewers : 0;
                    return s.viewers / gViewers > this.sigCutoff;
                });
                var newSnapshots = filtered.map((s) => {
                    return new ChannelSnapshot(s.channel._id, this.time, {
                        game_id: g._id,
                        viewers: s.viewers
                    });
                });
                var newChannels = filtered.map((s) => {
                    return new Channel(s.channel._id, {
                        name: s.channel.name,
                        display_name: s.channel.display_name,
                        url: s.channel.url,
                        logo_art: s.channel.logo
                    });
                });
                this.channelSnapshots = this.channelSnapshots.concat(newSnapshots);
                this.channels = this.channels.concat(newChannels);
            }, reject);
            promises.push(p);
        });
        Promise.all(promises).then(resolve.bind(this, this), reject);
    });
};

Snapshot.prototype.getGameSnapshotsFromTwitch = function() {
    return new Promise((resolve, reject) => {
        var gamesPromise = twitch.games({ limit: this.gameLimit }).then((res) => {
            var filtered = res.filter(g => {
                return g.viewers / this.summary.viewers > this.sigCutoff;
            });
            this.gameSnapshots = filtered.map((g) => {
                return new GameSnapshot(g.game._id, this.time, g);
            });
            this.games = filtered.map((g) => {
                return new Game(g.game._id, {
                    name: g.game.name,
                    box_art: g.game.box.large,
                    logo_art: g.game.logo.large,
                });
            });
            resolve(this);
        }, reject);
    });
};

Snapshot.prototype.getFromTwitch = function(channels) {
    return new Promise((resolve, reject) => {
        this.summary.getFromTwitch().then(() => {
            return this.getGameSnapshotsFromTwitch();
        }, reject)
        .then(() => {
            if (!channels) return;
            else return this.getChannelSnapshotsFromTwitch();
        }, reject).then(resolve.bind(this, this), reject);
    });
};

Snapshot.prototype.getGameSnapshots = function() {
    return new Promise((resolve, reject) => {
        var queryText = 'SELECT * FROM game_snapshots JOIN games ON (games._id = game_snapshots.game_id) WHERE game_snapshots.snapshot_time = $1';
        return query(queryText, [ this.time.toISOString() ]).then(res => {
            this.gameSnapshots = res.rows.map((g) => {
                return new GameSnapshot(g.game_id, g.snapshot_time, g);
            });
            this.games = res.rows.map((g) => {
                return new Game(g.game_id, g);
            });
            resolve(this);
        }, reject);
    });
};

Snapshot.prototype.get = function() {
    return new Promise((resolve, reject) => {
        this.summary.get().then(() => {
            this.getGameSnapshots().then(resolve, reject);
        }, reject);
    });
};

Snapshot.prototype.save = function() {
    return new Promise((resolve, reject) => {
        if (!this.gameSnapshots.length) return reject('No game snapshots to save');

        var promises = [];

        // save summary
        promises.push(this.summary.save());

        // save all games
        this.games.forEach((g) => {
            promises.push(g.save());
        });
        Promise.all(promises)
            // save game snapshots after we've saved all of the summaries/games
            .then(() => {
                return Promise.all(this.gameSnapshots.map(g => { return g.save(); }))
            })
            .then(resolve, reject);
    });
};

Snapshot.prototype.prettify = function() {
    var games = this.gameSnapshots.map((gs) => {
        var g = this.games.filter(g => g._id === gs.game_id);
        g = g.length ? g[0] : {};
        var streams = this.channelSnapshots
            .filter(cs => cs.game_id === g._id)
            .map(cs => {
                var c = this.channels.filter(c => c._id === cs.channel_id);
                c = c.length ? c[0] : {};
                return {
                    name: c.name,
                    displayName: c.display_name,
                    url: c.url,
                    image: c.logo_art,
                    viewers: cs.viewers || 0
                };
            });
        streams.push({
            name: 'other',
            displayName: 'Other',
            viewers: gs.viewers - streams.reduce((t, s) => (t.viewers || t) + s.viewers, 0)
        });
        return {
            name: g.name,
            image: g.box_art,
            viewers: gs.viewers || 0,
            channels: gs.channels,
            streams: streams
        };
    });
    var r = {
        time: this.time,
        viewers: this.summary.viewers || 0,
        channels: this.summary.channels || 0,
        games: games
    };
    r.games.push({
        name: 'Other',
        viewers: r.viewers - r.games.reduce((t, g) => (t.viewers || t) + g.viewers, 0),
        channels: r.channels - r.games.reduce((t, g) => (t.channels || t) + g.channels, 0)
    });
    return r;
};

module.exports = Snapshot;
