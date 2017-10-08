var express = require('express');
var cors = require('cors');
var router = express.Router();


var whitelist = ['digits2.twitch.pub']
var corsOptions = {
    origin: function(origin, callback) {
        if (!origin || origin.indexOf('localhost') !== -1 || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
};
router.use(cors(corsOptions));


router.get('/test', function(req, res) {
    res.json({ importantMessage: 'what up fam?' });
});

router.use('/snapshot', require('./snapshot'));

module.exports = router;
