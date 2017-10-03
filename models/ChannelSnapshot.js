var ChannelSnapshot = function(client, channel_id, snapshot_time, options) {
    this.client = client;
    this.channel_id = channel_id;
    this.snapshot_time = snapshot_time;
    this.game_id = options.game_id;
    this.viewers = options.viewers;
};

ChannelSnapshot.prototype._insert = function() {
    return new Promise((resolve, reject) => {
        var queryText = 'INSERT INTO channel_snapshots(channel_id, snapshot_time, game_id, viewers) VALUES($1, $2, $3, $4)';
        this.client.query(queryText, [this.channel_id, this.snapshot_time, this.game_id, this.viewers], function(err, res) {
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
