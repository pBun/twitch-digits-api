<template>
<div class="snapshot-menu">
    <a class="snapshot-link" v-for="(t, i) in times" :style="{ height: calcHeight(t) }"
        @click="handleLink(t._time)" v-tooltip="prettyTime(t._time)">{{ i }}</a>
</div>
</template>

<script>
import { VTooltip } from 'v-tooltip';
export default {
    props: [ 'times' ],
    computed: {
        maxViewers(scope) {
            return scope.times.reduce((a, b) => Math.max(a.viewers || 0, b.viewers), 0);
        }
    },
    methods: {
        calcHeight(v) {
            return this.percent(v.viewers / this.maxViewers, 2);
        },
        percent(v, decimals) {
            if (typeof v !== 'number') return v;
            return (v * 100).toFixed(decimals || 0) + '%';
        },
        prettyTime(v) {
            if (!v) return v;
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
    border: 1px solid #6441a5;
    transition: background-color 0.3s;
}
.twitch-digits .snapshot-link:hover {
    background-color: rgba(100, 65, 165, 0.95);
}
</style>
