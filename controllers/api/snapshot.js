var express = require('express');
var router = express.Router();

var { jsonRes } = require('./utils');

var db = require('../../models/db');

var Game = require('../../models/Game');
var Snapshot = require('../../models/Snapshot');

router.get('/', function(req, res) {
    new Snapshot().getFromTwitch()
        .then(snapshot => jsonRes(res, snapshot.prettify()), err => jsonRes(res, null, err || true));
});

router.get('/times', function(req, res) {
    db.getSnapshotTimes()
        .then(times => jsonRes(res, times.map(t => t._time)), err => jsonRes(res, null, err || true));
});

router.get('/:time', function(req, res) {
    var time = new Date(req.params.time);
    if (isNaN(time.getTime())) return jsonRes(res, null, time.toString());
    new Snapshot(time).get()
        .then((snapshot) => jsonRes(res, snapshot.prettify()), err => jsonRes(res, null, err || true));
});

module.exports = router;
