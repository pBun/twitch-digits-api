var client = require('./client');

var Channel = function(id, options) {
    this._id = id;
    this.name = options.name;
    this.display_name = options.display_name;
    this.url = options.url;
    this.logo_art = options.logo_art;
};

Channel.prototype._insert = function() {
    return new Promise((resolve, reject) => {
        var queryText = 'INSERT INTO channels(_id, name, display_name, url, logo_art) VALUES($1, $2, $3, $4, $5)';
        client.query(queryText, [this._id, this.name, this.display_name, this.url, this.logo_art], function(err, res) {
            if (err) return reject(err);
            resolve();
        });
    });
};

Channel.prototype._update = function() {
    return new Promise((resolve, reject) => {
        var queryText = 'UPDATE channels SET(name, display_name, url logo_art) = ($2, $3, $4, $5) WHERE _id = $1';
        client.query(queryText, [this._id, this.name, this.display_name, this.url, this.logo_art], function(err, res) {
            if (err) return reject(err);
            resolve();
        });
    });
};

Channel.prototype.save = function() {
    return new Promise((resolve, reject) => {
        this._insert()
            .then(resolve, (err) => {
                if (err.code !== '23505') return reject(err);
                return this._update().then(resolve, reject);
            });
    });
};

module.exports = Channel;
