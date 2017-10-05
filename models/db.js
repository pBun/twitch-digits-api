var { Client } = require('pg');
var pgOpts = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: true
} : null;

module.exports = {
    client: (opts) => new Client(Object.assign({}, pgOpts, opts)),
    getSnapshotTimes: () => {
        return new Promise((resolve, reject) => {
            var client = new Client(pgOpts);
            client.connect();
            var queryText = 'SELECT _time FROM summary_snapshots';
            client.query(queryText, (err, res) => {
                client.end();
                if (err || !res.rows.length) return reject(err);
                resolve(res.rows);
            });
        });
    }
};
