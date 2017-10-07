var { query } = require('../../models/db');

var ChannelSnapshot = function(channel_id, snapshot_time, options) {
    options = options || {};
    this.channel_id = channel_id;
    this.snapshot_time = snapshot_time;
    this.game_id = options.game_id;
    this.viewers = options.viewers;
};

ChannelSnapshot.prototype.get = function() {
    return new Promise((resolve, reject) => {
        var queryText = 'SELECT * FROM channel_snapshots WHERE channel_id = $1 AND snapshot_time = $2';
        query(queryText, [this.channel_id, this.snapshot_time]).then(res => {
            if (!res.rows.length) return reject('Channel snapshot not found.');
            Object.assign(this, res.rows[0]);
            resolve(this);
        }, reject);
    });
};

ChannelSnapshot.prototype._insert = function() {
    return new Promise((resolve, reject) => {
        var queryText = 'INSERT INTO channel_snapshots(channel_id, snapshot_time, game_id, viewers) VALUES($1, $2, $3, $4)';
        query(queryText, [this.channel_id, this.snapshot_time, this.game_id, this.viewers]).then(resolve, reject);
    });
};

ChannelSnapshot.prototype.save = function() {
    return new Promise((resolve, reject) => {
        this._insert()
            .then(resolve, reject);
    });
};

module.exports = ChannelSnapshot;
