require('./styles.css');
var React = require('react');
var ReactDOM = require('react-dom');
var ForkMe = require('../ForkMe');

var App = (props) => {
    return (<div id="app">
            <header className="header">
                <div className="header-inner">
                    <h1><a className="logo" href="/">twitch digits</a></h1>
                    <h2>a breakdown of twitch.tv popularity</h2>
                </div>
            </header>
            <main className="main-wrapper">

            </main>
            <ForkMe url="https://github.com/pBun/twitch-digits" />
      </div>);
};

module.exports = App;
