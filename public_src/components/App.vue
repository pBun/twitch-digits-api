<template>
<div id="app">
      <header class="header">
          <div class="header-inner">
              <h1><a class="logo" href="/">twitch digits</a></h1>
              <h2>a breakdown of twitch.tv popularity</h2>
          </div>
      </header>
      <main class="main-wrapper">
          <twitch-digits></twitch-digits>
      </main>
      <fork-me url="https://github.com/pBun/twitch-digits"></fork-me>
</div>
</template>

<script>
import TwitchDigits from './TwitchDigits.vue';
import ForkMe from './ForkMe.vue';
export default {
    name: 'app',
    components: { ForkMe, TwitchDigits }
}
</script>

<style>
#app {
    text-align: center;
}
#app .header {
    text-align: center;
    padding-top: 5vh;
}
#app .header .logo {
    font-size: 3.5em;
    font-weight: 100;
    line-height: 1.2em;
    letter-spacing: -0.05em;
    border-bottom: none;
}
#app .fork-me {
    position: absolute;
    top: 0;
    right: 0;
    border: 0;
    max-width: 33%;
}
@media (max-width: 480px) {
    #app .header .logo {
        font-size: 2.5em;
    }
}
</style>
