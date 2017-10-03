var request = require('request');
var config = require('./config');

module.exports = function(options) {
    var opts = Object.assign({
        limit: 100,
        offset: 0
    }, options);

    return new Promise((resolve, reject) => {
        request({
            method: 'get',
            url: config.host + '/games/top',
            qs: opts,
            headers: config.defaultHeaders
        }, (error, response, data) => {
            var d = JSON.parse(data || '') || {};
            resolve(d.top);
        });
    });

};
