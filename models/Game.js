var { query } = require('../models/db');

var Game = function(id, options) {
    options = options || {};
    this._id = id;
    this.name = options.name;
    this.box_art = options.box_art;
    this.logo_art = options.logo_art;
};

Game.prototype.get = function() {
    return new Promise((resolve, reject) => {
        var queryText = 'SELECT * FROM games WHERE _id = $1';
        query(queryText, [this._id]).then(res => {
            if (!res.rows.length) return reject('Game not found (' + this._id + ').');
            Object.assign(this, res.rows[0]);
            resolve(this);
        }, reject);
    });
};

Game.prototype._insert = function() {
    return new Promise((resolve, reject) => {
        var queryText = 'INSERT INTO games(_id, name, box_art, logo_art) VALUES($1, $2, $3, $4)';
        query(queryText, [this._id, this.name, this.box_art, this.logo_art]).then(resolve, reject);
    });
};

Game.prototype._update = function() {
    return new Promise((resolve, reject) => {
        var queryText = 'UPDATE games SET(name, box_art, logo_art) = ($2, $3, $4) WHERE _id = $1';
        query(queryText, [this._id, this.name, this.box_art, this.logo_art]).then(resolve, reject);
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
