var express = require('express');
var router = express.Router();

router.get('/test', function(req, res) {
    res.json({ importantMessage: 'what up fam?' });
});

module.exports = router;
