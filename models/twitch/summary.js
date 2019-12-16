var request = require('request');
var config = require('./config');

module.exports = function(options) {
    var opts = Object.assign({}, options);

    return new Promise((resolve, reject) => {
        request({
            method: 'get',
            url: config.host + '/streams/summary',
            qs: opts,
            headers: config.defaultHeaders,
        }, (error, response, data) => {
            if (error) return reject(error);
            var d = JSON.parse(data || '') || {};
            resolve(d);
        });
    });

};
