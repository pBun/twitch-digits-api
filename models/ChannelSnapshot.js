var db = require('./db');

var ChannelSnapshot = function(channel_id, snapshot_time, options) {
    options = options || {};
    this.channel_id = channel_id;
    this.snapshot_time = snapshot_time;
    this.game_id = options.game_id;
    this.viewers = options.viewers;
};

ChannelSnapshot.prototype.get = function() {
    return new Promise((resolve, reject) => {
        var client = db.client();
        client.connect();
        var queryText = 'SELECT * FROM channel_snapshots WHERE channel_id = $1 AND snapshot_time = $2';
        client.query(queryText, [this.channel_id, this.snapshot_time], (err, res) => {
            client.end();
            if (err) return reject(err);
            if (!res.rows.length) return reject('Channel snapshot not found.');
            Object.assign(this, res.rows[0]);
            resolve(this);
        });
    });
};

ChannelSnapshot.prototype._insert = function() {
    return new Promise((resolve, reject) => {
        var client = db.client();
        client.connect();
        var queryText = 'INSERT INTO channel_snapshots(channel_id, snapshot_time, game_id, viewers) VALUES($1, $2, $3, $4)';
        client.query(queryText, [this.channel_id, this.snapshot_time, this.game_id, this.viewers], (err, res) => {
            client.end();
            if (err) return reject(err);
            resolve();
        });
    });
};

ChannelSnapshot.prototype.save = function() {
    return new Promise((resolve, reject) => {
        this._insert()
            .then(resolve, reject);
    });
};

module.exports = ChannelSnapshot;
