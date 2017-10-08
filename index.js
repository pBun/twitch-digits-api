var express = require('express');
var app = express();

var p = process.env.NODE_ENVIRONMENT === 'production' ? '/public' : '/public_dev';
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + p));
app.use(require('./controllers'));

app.listen(app.get('port'), function() {
    console.log('App is running at localhost:' + app.get('port'));
})
