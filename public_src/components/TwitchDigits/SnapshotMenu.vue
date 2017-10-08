<template>
<div class="snapshot-menu">
    <a class="snapshot-link" v-for="(t, i) in times" :class="{ 'selected': t._time === selected }" :style="{ height: calcHeight(t.viewers) }"
        @click="handleLink(t._time)" v-tooltip="prettyTime(t._time)">{{ i }}</a>
</div>
</template>

<script>
import { VTooltip } from 'v-tooltip';
export default {
    props: [ 'times', 'selected' ],
    computed: {
        maxViewers(scope) {
            return scope.times
                .map(a => a.viewers)
                .reduce((a, b) => Math.max(a || 0, b), 0);
        }
    },
    methods: {
        calcHeight(v) {
            return this.percent(v / this.maxViewers, 2);
        },
        percent(v, decimals) {
            if (typeof v !== 'number') return v;
            return (v * 100).toFixed(decimals || 0) + '%';
        },
        prettyTime(v) {
            if (!v) return 'Now';
            var d = new Date(v);
            return d.toLocaleString();
        },
        handleLink(time) {
            this.$emit('linkClick', time);
        }
    },
    directives: { tooltip: VTooltip }
}
</script>

<style>
.twitch-digits .snapshot-menu {
    position: absolute;
    top: 90%;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}
.twitch-digits .snapshot-link {
    display: block;
    width: 100%;
    text-align: center;
    cursor: pointer;
    background-color: rgba(100, 65, 165, 0.5);
    height: 10%;
    text-indent: -100%;
    overflow: hidden;
    transition: background-color 0.3s;
    margin-left: 2px;
    margin-right: 2px;
}
.twitch-digits .snapshot-link:hover {
    background-color: rgba(100, 65, 165, 0.95);
}
.twitch-digits .snapshot-link.selected {
    background-color: rgba(100, 65, 165, 1);
}
</style>
