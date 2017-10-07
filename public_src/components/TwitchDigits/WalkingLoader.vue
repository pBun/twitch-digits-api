<template>
<div class="walking-loader">
    <div class="dot" v-for="i in numDots"></div>
</div>
</template>

<script>
export default {
    data() {
        return {
            numDots: 5
        }
    }
}
</script>

<style>
.walking-loader {
  width: 100px;
  height: 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.walking-loader .dot {
    width: 20px;
    height: 20px;
    background: #6441a5;
    border-radius: 100%;
    position: absolute;
    animation: animate 2s linear infinite;
}
.walking-loader > div:nth-of-type(1) { animation-delay: -0.4s; }
.walking-loader > div:nth-of-type(2) { animation-delay: -0.8s; }
.walking-loader > div:nth-of-type(3) { animation-delay: -1.2s; }
.walking-loader > div:nth-of-type(4) { animation-delay: -1.6s; }
@keyframes animate {
  0% {
    left: 100px;
    top:0
  }
  80% {
    left: 0;
    top:0;
  }
  85% {
    left: 0;
    top: -20px;
    width: 20px;
    height: 20px;
  }
  90% {
    width: 40px;
    height: 15px;
  }
  95% {
    left: 100px;
    top: -20px;
    width: 20px;
    height: 20px;
  }
  100% {
    left: 100px; top:0;
  }
}
</style>
