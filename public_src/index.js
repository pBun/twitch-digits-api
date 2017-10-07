import './global.css';
import Vue from 'vue';
import App from './components/TwitchDigits/index.vue';

new Vue({
    el: '#app',
    render: function(h) { return h(App) }
});
