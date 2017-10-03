var Game = function(client, id, options) {
    this.client = client;
    this._id = id;
    this.name = options.name;
    this.box_art = options.box_art;
    this.logo_art = options.logo_art;
};

Game.prototype._insert = function() {
    return new Promise((resolve, reject) => {
        var queryText = 'INSERT INTO games(_id, name, box_art, logo_art) VALUES($1, $2, $3, $4)';
        this.client.query(queryText, [this._id, this.name, this.box_art, this.logo_art], function(err, res) {
            if (err) return reject(err);
            resolve();
        });
    });
};

Game.prototype._update = function() {
    return new Promise((resolve, reject) => {
        var queryText = 'UPDATE games SET(name, box_art, logo_art) = ($2, $3, $4) WHERE _id = $1';
        this.client.query(queryText, [this._id, this.name, this.box_art, this.logo_art], function(err, res) {
            if (err) return reject(err);
            resolve();
        });
    });
};

Game.prototype.save = function() {
    return new Promise((resolve, reject) => {
        this._insert()
            .then(resolve, (err) => {
                if (err.code !== '23505') return reject(err);
                return this._update().then(resolve, reject);
            });
    });
};

module.exports = Game;
