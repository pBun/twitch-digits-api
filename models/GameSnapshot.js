var GameSnapshot = function(client, game_id, snapshot_time, options) {
    this.client = client;
    this.game_id = game_id;
    this.snapshot_time = snapshot_time;
    this.channels = options.channels;
    this.viewers = options.viewers;
};

GameSnapshot.prototype._insert = function() {
    return new Promise((resolve, reject) => {
        var queryText = 'INSERT INTO game_snapshots(game_id, snapshot_time, channels, viewers) VALUES($1, $2, $3, $4)';
        this.client.query(queryText, [this.game_id, this.snapshot_time, this.channels, this.viewers], function(err, res) {
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
