<template>
<div id="app">
      <header class="header">
          <fork-me url="https://github.com/pBun/twitch-digits"></fork-me>
          <div class="header-inner">
              <h1><a class="logo" href="/">twitch digits</a></h1>
              <h2>a breakdown of twitch.tv popularity</h2>
          </div>
      </header>
      <main class="main-wrapper">
          <twitch-digits></twitch-digits>
      </main>
</div>
</template>

<script>
import TwitchDigits from './TwitchDigits/index.vue';
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
    position: relative;
    text-align: center;
    padding-top: 5vh;
}
#app .header .logo {
    display: inline-block;
    font-size: 3.5em;
    font-weight: 100;
    line-height: 1em;
    letter-spacing: -0.05em;
    border-bottom: none;
    margin-bottom: 0.075em;
}
#app .header .fork-me {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    border: 0;
    max-width: 33%;
}
#app .header .fork-me img {
  display: block;
  max-width: 100%;
  max-height: 100%;
}
@media (max-width: 480px) {
    #app .header .logo {
        font-size: 2.5em;
    }
}
</style>
