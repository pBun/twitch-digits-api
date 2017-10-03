var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res) {
    res.json({ 'your-id': req.params.id });
});

module.exports = router;
