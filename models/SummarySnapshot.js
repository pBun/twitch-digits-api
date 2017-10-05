var client = require('./client');
var twitch = require('../api/twitch');

var SummarySnapshot = function(_time, options) {
    options = options || {};
    this._time = _time;
    this.channels = options.channels;
    this.viewers = options.viewers;
};

SummarySnapshot.prototype.getFromTwitch = function() {
    return new Promise((resolve, reject) => {
        twitch.summary()
            .then((res) => {
                this.channels = res.channels;
                this.viewers = res.viewers;
                resolve(this);
            }, reject);
    });
};

SummarySnapshot.prototype.get = function() {
    return new Promise((resolve, reject) => {
        var queryText = 'SELECT * FROM summary_snapshots WHERE _time=$1';
        client.query(queryText, [this._time], function(err, res) {
            if (err || !res.rows.length) return reject(err);
            Object.assign(this, res.rows[0]);
            resolve(this);
        });
    });
};

SummarySnapshot.prototype._insert = function() {
    return new Promise((resolve, reject) => {
        var queryText = 'INSERT INTO summary_snapshots(_time, channels, viewers) VALUES($1, $2, $3)';
        client.query(queryText, [this._time, this.channels, this.viewers], function(err, res) {
            if (err) return reject(err);
            resolve();
        });
    });
};

SummarySnapshot.prototype.save = function() {
    return new Promise((resolve, reject) => {
        this._insert()
            .then(resolve, reject);
    });
};

module.exports = SummarySnapshot;
