var { Client } = require('pg');
var pgOpts = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: true
} : null;
var client = new Client(pgOpts);
client.connect();

module.exports = client;
