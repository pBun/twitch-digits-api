var axios = require('axios');
var config = require('./config');

module.exports = function(options) {
    return new Promise((resolve, reject) => {
        var opts = Object.assign({}, options);
        axios({
            method: 'get',
            url: config.host + '/streams/summary',
            params: opts,
            headers: config.defaultHeaders,
            responseType: 'json',
        })
          .catch((err) => {
              reject(err);
          })
          .then((res) => {
            const data = res && res.data;
            resolve(data || {});
          });
    });

};
