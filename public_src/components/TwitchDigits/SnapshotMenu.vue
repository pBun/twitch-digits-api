<template>
<div class="snapshot-menu">
    <a class="snapshot-link" v-for="(t, i) in times"
        @click="handleLink(t._time)" v-tooltip="prettyTime(t._time)">{{ i }}</a>
</div>
</template>

<script>
import { VTooltip } from 'v-tooltip';
export default {
    props: [ 'times' ],
    methods: {
        prettyTime(v) {
            if (!v) return v;
            var d = new Date(v);
            return d.toString();
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
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
}
.twitch-digits .snapshot-link {
    display: block;
    width: 100%;
    text-align: center;
    cursor: pointer;
}
</style>
