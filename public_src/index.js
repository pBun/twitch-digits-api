require('file-loader?name=[name].[ext]!./index.html');

var Vue = require('vue').default;
var App = require('./App.vue').default;

new Vue({
    el: '#app',
    render: function(h) { return h(App); }
});
