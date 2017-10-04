<template>
  <div id="app">
        <!-- <img src="./assets/logo.png"> -->
        <header class="header">
            <div class="header-inner">
                <h1><a class="logo" href="/">twitch digits</a></h1>
                <h2>a breakdown of twitch.tv popularity</h2>
            </div>
        </header>
        <main class="main-wrapper">

        </main>
        <a class="fork-me" href="https://github.com/pBun/twitch-digits"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"></a>
  </div>
</template>

<script>
module.exports = {
    name: 'app',
    data: function() {
        return {};
    }
};
</script>

<style>
* {
    box-sizing: border-box;
}
body {
    color: #32323e;
    font-family: Roboto, sans-serif;
    font-weight: 300;
    line-height: 1.2em;
    font-size: 16px;
}
h1, h2, h3, h4, h5, h6 {
    font-weight: inherit;
    font-size: inherit;
    margin: 0;
}
a {
    text-decoration: none;
    color: #6441a5;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s ease-in-out;
}
.fork-me img {
    max-width: 33%;
}
#app .header {
    text-align: center;
    margin-top: 3em;
}
#app .header .logo {
    font-size: 3.5em;
    font-weight: 100;
    line-height: 1.2em;
    letter-spacing: -0.05em;
    border-bottom: none;
}
@media (max-width: 480px) {
    #app .header .logo {
        font-size: 2.5em;
    }
}
</style>
