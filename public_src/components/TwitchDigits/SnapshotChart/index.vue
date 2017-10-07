<template>
<div class="snapshot-chart chart-wrapper">
    <div class="explanation" v-if="selectedGame" :style="{ backgroundImage: bgImg(selectedData.image) }">
        <div class="info">
            <p class="inner-info">
                <span class="stat">{{ selectedData.viewers / baseData.viewers | percent(2) }}</span>
                of all <strong>{{ selectedChannel ? selectedGame.name : '' }}</strong> viewers are currently watching <strong>{{ selectedData.name }}</strong>
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
            return scope.selectedChannel ? scope.selectedGame :
                    scope.selectedGame ? scope.snapshot : { name: '', viewers: 0 };
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
.twitch-digits .snapshot-chart {
    position: relative;
    display: inline-block;
    min-height: 320px;
    min-width: 320px;
}
.twitch-digits .snapshot-chart .explanation {
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 56.5%;
  height: 56.5%;
  border-radius: 50%;
  text-align: center;
  color: #666;
  pointer-events: none;
  background: no-repeat;
  background-size: cover;
}

.twitch-digits .snapshot-chart .explanation .info {
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
.twitch-digits .snapshot-chart .explanation .info .inner-info {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  margin: 0;
}

.twitch-digits .snapshot-chart .explanation .info .inner-info .stat {
  font-size: 2.5em;
  line-height: 1.25em;
  display: block;
}

.twitch-digits .snapshot-chart .explanation .back-info {
  color: #fff;
  position: absolute;
  bottom: 20%;
  left: 0;
  right: 0;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}
.twitch-digits .snapshot-chart .chart-zoomed .explanation .back-info {
  opacity: 0.5;
}
</style>
