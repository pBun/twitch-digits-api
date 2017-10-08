var { Pool } = require('pg');
var pgOpts = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
    max: process.env.DB_CLIENTS || 19
} : null;
var pool = new Pool(Object.assign({}, pgOpts));
var query = (queryText, queryValues) => {
    return new Promise((resolve, reject) => {
        pool.connect()
          .then(client => {
            return client.query(queryText, queryValues)
              .then(res => {
                client.release();
                resolve(res);
              })
              .catch(e => {
                client.release()
                reject(e);
              })
          }, reject);
    });
};

module.exports = {
    pool: pool,
    query: query,
    getSnapshotTimes: () => {
        return new Promise((resolve, reject) => {
            var queryText = 'SELECT _time, viewers, channels FROM summary_snapshots';
            query(queryText).then(res => {
                resolve(res.rows);
            }, reject);
        });
    }
};
