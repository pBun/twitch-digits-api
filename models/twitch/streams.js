var axios = require('axios');
var config = require('./config');

module.exports = function(options) {
    return new Promise((resolve, reject) => {
        var opts = Object.assign({
            stream_type: 'live',
            limit: 25,
            offset: 0
        }, options);
        axios({
            method: 'get',
            url: config.host + '/streams',
            params: opts,
            headers: config.defaultHeaders,
            responseType: 'json',
        })
          .catch((err) => {
              reject(err);
          })
          .then((res) => {
              const data = res && res.data && res.data.streams;
              resolve(data || {});
          });
    });

};
