var db = require('../../models/db');
var twitch = require('../../models/twitch');

var SummarySnapshot = require('../../models/Snapshot/SummarySnapshot');
var Game = require('../../models/Game');
var GameSnapshot = require('../../models/Snapshot/GameSnapshot');

var Snapshot = function(time) {
    this.gameLimit = 50;
    this.sigCutoff = 0.001
    this.time = time || new Date();
    this.summary = new SummarySnapshot(this.time);
    this.gameSnapshots = [];
    this.games = [];
};

Snapshot.prototype.getFromTwitch = function() {
    return new Promise((resolve, reject) => {
        this.summary.getFromTwitch().then(() => {
            return twitch.games({ limit: this.gameLimit });
        }, reject).then((res) => {
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

Snapshot.prototype.get = function() {
    return new Promise((resolve, reject) => {
        this.summary.get().then(() => {
            var client = db.client();
             client.connect();
            var queryText = 'SELECT * FROM game_snapshots JOIN games ON (games._id = game_snapshots.game_id) WHERE game_snapshots.snapshot_time = $1';
            return client.query(queryText, [ this.time.toISOString() ], (err, res) => {
                client.end();
                if (err) return reject(err);
                this.gameSnapshots = res.rows.map((g) => {
                    return new GameSnapshot(g.game_id, g.snapshot_time, g);
                });
                this.games = res.rows.map((g) => {
                    return new Game(g.game_id, g);
                });
                resolve(this);
            });
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
    var r = {
        viewers: this.summary.viewers || 0,
        channels: this.summary.channels || 0,
        games: this.gameSnapshots.map((gs) => {
            var g = this.games.filter(g => g._id === gs.game_id);
            g = g.length && g[0];
            return {
                name: g.name,
                image: g.box_art,
                viewers: gs.viewers,
                channels: gs.channels
            }
        })
    };
    r.games.push({
        name: 'Other Games',
        viewers: r.viewers - r.games.reduce((t, g) => (t.viewers || t) + g.viewers),
        channels: r.channels - r.games.reduce((t, g) => (t.channels || t) + g.channels)
    });
    return r;
};

module.exports = Snapshot;
