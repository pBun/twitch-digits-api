var client = require('./client');
var twitch = require('../api/twitch');

var SummarySnapshot = require('../models/SummarySnapshot');
var Game = require('../models/Game');
var GameSnapshot = require('../models/GameSnapshot');

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

Snapshot.prototype.save = function() {
    return new Promise((resolve, reject) => {

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

module.exports = Snapshot;
