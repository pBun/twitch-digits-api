var express = require('express');
var cors = require('cors');
var router = express.Router();


var whitelist = ['http://digits2.twitch.pub']
var corsOptions = {
    origin: function(origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true)
        } else {
            callback(origin + ' not allowed by CORS.')
        }
    }
};
router.use(cors(corsOptions));


router.get('/test', function(req, res) {
    res.json({ importantMessage: 'what up fam?' });
});

router.use('/snapshot', require('./snapshot'));

module.exports = router;
