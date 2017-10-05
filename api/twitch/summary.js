var request = require('request');
var config = require('./config');

module.exports = function(options) {
    var opts = Object.assign({}, options);

    return new Promise((resolve, reject) => {
        request({
            method: 'get',
            url: config.host + '/streams/summary',
            qs: opts,
            headers: config.defaultHeaders
        }, (error, response, data) => {
            var d = JSON.parse(data || '') || {};
            resolve(d);
        });
    });

};
