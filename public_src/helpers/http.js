function get(url) {
    return new Promise(function(resolve, reject) {
        let req = new XMLHttpRequest();
        req.open('GET', url);
        req.onload = function() {
            if (req.status === 200) {
                resolve(req.response);
            } else {
                reject(new Error(req.statusText));
            }
        };

        req.onerror = function() {
            reject(new Error('Network error'));
        };

        req.send();
    });
};

function getJson(url) {
    return new Promise(function(resolve, reject) {
        get(url).then(res => {
            if (!res) reject('empty response - ' + url);
            var d = JSON.parse(res);
            if (d.status === 'error') return reject(d.message);
            resolve(d.data);
        }, reject);
    });
};

export default { get, getJson };
