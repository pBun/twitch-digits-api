var client = require('./client');

var GameSnapshot = function(_time, options) {
    this._time = _time;
    this.channels = options.channels;
    this.viewers = options.viewers;
};

GameSnapshot.prototype._insert = function() {
    return new Promise((resolve, reject) => {
        var queryText = 'INSERT INTO snapshots(_time, channels, viewers) VALUES($1, $2, $3)';
        client.query(queryText, [this._time, this.channels, this.viewers], function(err, res) {
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
