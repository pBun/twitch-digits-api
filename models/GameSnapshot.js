var db = require('./db');

var GameSnapshot = function(game_id, snapshot_time, options) {
    options = options || {};
    this.game_id = game_id;
    this.snapshot_time = snapshot_time;
    this.channels = options.channels;
    this.viewers = options.viewers;
};

GameSnapshot.prototype.getFromTwitch = function(name) {
    return new Promise((resolve, reject) => {
        twitch.games({ game: name })
            .then((res) => {
                this.game_id = res.game._id;
                this.snapshot_time = new Date();
                this.channels = res.channels;
                this.viewers = res.viewers;
                resolve(this);
            }, reject);
    });
};

GameSnapshot.prototype.get = function() {
    return new Promise((resolve, reject) => {
        var client = db.client();
        client.connect();
        var queryText = 'SELECT * FROM snapshots WHERE game_id = $1 AND snapshot_time = $2';
        client.query(queryText, [this.game_id, this.snapshot_time], (err, res) => {
            client.end();
            if (err) return reject(err);
            if (!res.rows.length) return reject('No snapshots for ' + this.game_id + ' found at this time (' + this.snapshot_time + ').');
            Object.assign(this, res.rows[0]);
            resolve(this);
        });
    });
};

GameSnapshot.prototype._insert = function() {
    return new Promise((resolve, reject) => {
        var client = db.client();
        client.connect();
        var queryText = 'INSERT INTO game_snapshots(game_id, snapshot_time, channels, viewers) VALUES($1, $2, $3, $4)';
        client.query(queryText, [this.game_id, this.snapshot_time, this.channels, this.viewers], (err, res) => {
            client.end();
            if (err) return reject(err);
            resolve();
        });
    });
};

GameSnapshot.prototype.save = function() {
    return new Promise((resolve, reject) => {
        this._insert()
            .then(resolve, reject);
    });
};

module.exports = GameSnapshot;
