var { Client } = require('pg');
var pgOpts = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: true
} : null;
var client = new Client(pgOpts);
module.exports = client;
