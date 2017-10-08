<template>
<div class="chart-wrapper">
    <div class="explanation" :style="{ backgroundImage: bgImg(selectedData.image) }">
        <div class="info">
            <p class="inner-info" v-if="selectedGame">
                <span class="title">{{ selectedData.name }}</span>
                <span class="stat">
                  <strong class="value">{{ selectedGame.viewers | prettyNumber }} | {{ selectedGame.viewers / baseData.viewers | percent(2) }}</strong>
                </span>
            </p>
            <p class="inner-info" v-if="snapshot && !selectedGame && !selectedChannel">
              <span class="stat">
                <span class="icon"><svg viewBox="0 0 16 16" height="100%" version="1.1" width="100%" x="0px" y="0px"><path clip-rule="evenodd" d="M11,14H5H2v-1l3-3h2L5,8V2h6v6l-2,2h2l3,3v1H11z" fill-rule="evenodd"></path></svg></span>
                <strong class="value">{{ baseData.viewers | prettyNumber }}</strong>
              </span>
            </p>
        </div>
        <span class="back-info">click to go back</span>
    </div>
</div>
</template>

<script>
import util from '../util';
import TwitchChart from './TwitchChart';
export default {
    props: [ 'snapshot' ],
    data() {
        return {
            chart: null,
            chartState: {},
            zoomed: false,
            selectedGame: null,
            selectedChannel: null
        };
    },
    computed: {
        selectedData(scope) {
            return scope.selectedChannel || scope.selectedGame || scope.snapshot || { name: '', viewers: 0 };
        },
        baseData(scope) {
            return scope.snapshot || { name: '', viewers: 0 };
        },
        chartData(scope) {
            var d = util.clone(scope.snapshot);
            d.children = d.games.map(g => { g.type = 'game'; return g; });
            delete d.games;
            d.name = 'games';
            d.type = 'root';
            return d;
        }
    },
    methods: {
        bgImg(v) {
            if (!v) return '';
            return 'url(' + v + ')';
        },
        rootChangeCallback(d) {
            this.zoomed = d.type === 'game';
            this.selectedGame = this.zoomed ? d : this.selectedGame;
        },
        selectedCallback(d) {
            if (!d && !this.zoomed) {
                this.selectedGame = null;
                this.selectedChannel = null;
            } else if (!d) {
                this.selectedChannel = null;
            } else if (d.type === 'game') {
                this.selectedGame = d;
            } else if (d.type === 'channel') {
                this.selectedChannel = d;
            }
        },
        handleResize() {
            if (!this.chart) return;
            this.chart.init();
            this.chart.build(this.chartData);
        }
    },
    filters: {
        percent(v, decimals) {
            if (typeof v !== 'number') return v;
            return (v * 100).toFixed(decimals || 0) + '%';
        },
        prettyNumber(v) {
          return v.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    },
    watch: {
        snapshot() {
            this.chart =
                this.chart || new TwitchChart(this.$el, this.selectedCallback, this.rootChangeCallback);
            this.chart.build(this.chartData);
        }
    },
    mounted() {
        window.addEventListener('resize', this.handleResize);
    },
    destroyed() {
        window.removeEventListener('resize', this.handleResize);
    }
}
</script>

<style>
.chart-wrapper {
    position: relative;
    display: inline-block;
    min-height: 320px;
    min-width: 320px;
}
.chart-wrapper .explanation {
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 56.5%;
  height: 56.5%;
  width: 69.5%;
  height: 69.5%;
  border-radius: 50%;
  text-align: center;
  color: #666;
  pointer-events: none;
  background: no-repeat;
  background-size: cover;
}
.chart-wrapper .explanation .info {
  position: absolute;
  background: rgba(100,65,165,0.85);
  color: #fefefe;
  border-radius: 50%;
  width: 100%;
  height: 100%;
  margin: auto;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  box-sizing: border-box;
  text-align: center;
  padding: 20% 10%;
}
.chart-wrapper .explanation .info .inner-info {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  margin: 0;
}
.chart-wrapper .explanation .title {
  font-size: 1.5em;
  display: block;
  margin-bottom: 0.2em;
  line-height: 1em;
}
.chart-wrapper .explanation .stat {
  font-size: 2em;
  display: block;
  margin-bottom: 0.1em;
  line-height: 1em;
}
.chart-wrapper .explanation .icon,
.chart-wrapper .explanation .label,
.chart-wrapper .explanation .value {
  display: inline-block;
  vertical-align: middle;
}
.chart-wrapper .explanation .label {
  font-size: 0.6667em;
  line-height: 1em;
}
.chart-wrapper .explanation .icon {
  height: 1em;
  width: 1em;
  fill: #fff;
}
.chart-wrapper .explanation .back-info {
  color: #fff;
  position: absolute;
  bottom: 20%;
  left: 0;
  right: 0;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}
.chart-wrapper .chart-zoomed .explanation .back-info {
  opacity: 0.5;
}
</style>
