var { query } = require('../../models/db');
var twitch = require('../../models/twitch');

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
        var queryText = 'SELECT * FROM summary_snapshots WHERE _time = $1';
        query(queryText, [this._time]).then(res => {
            if (!res.rows.length) return reject('No summaries found for this time (' + this._time + ').');
            Object.assign(this, res.rows[0]);
            resolve(this);
        }, reject);
    });
};

SummarySnapshot.prototype._insert = function() {
    return new Promise((resolve, reject) => {
        var queryText = 'INSERT INTO summary_snapshots(_time, channels, viewers) VALUES($1, $2, $3)';
        query(queryText, [this._time, this.channels, this.viewers]).then(resolve, reject);
    });
};

SummarySnapshot.prototype.save = function() {
    return new Promise((resolve, reject) => {
        this._insert()
            .then(resolve, reject);
    });
};

module.exports = SummarySnapshot;
