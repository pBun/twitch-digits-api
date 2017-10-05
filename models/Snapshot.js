var client = require('./client');

var Snapshot = function(_time, options) {
    this._time = _time;
    this.channels = options.channels;
    this.viewers = options.viewers;
};

Snapshot.prototype._insert = function() {
    return new Promise((resolve, reject) => {
        var queryText = 'INSERT INTO snapshots(_time, channels, viewers) VALUES($1, $2, $3)';
        client.query(queryText, [this._time, this.channels, this.viewers], function(err, res) {
            if (err) return reject(err);
            resolve();
        });
    });
};

Snapshot.prototype.save = function() {
    return new Promise((resolve, reject) => {
        this._insert()
            .then(resolve, reject);
    });
};

module.exports = Snapshot;
