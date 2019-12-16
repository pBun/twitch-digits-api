var request = require('request');
var config = require('./config');

module.exports = function(options) {
    var opts = Object.assign({
        stream_type: 'live',
        limit: 25,
        offset: 0
    }, options);

    return new Promise((resolve, reject) => {
        request({
            method: 'get',
            url: config.host + '/streams',
            qs: opts,
            headers: config.defaultHeaders,
        }, (error, response, data) => {
            if (error) return reject(error);
            var d = JSON.parse(data || '') || {};
            resolve(d.streams);
        });
    });

};
