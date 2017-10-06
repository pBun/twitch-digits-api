<template>
<div class="twitch-digits">
    <div class="snapshot-menu">
        <a v-for="(t, i) in times" @click="loadSnapshot(t._time)">{{ i }}</a>
    </div>
    <walking-loader class="loader" :class="{ 'visible': (!initialized || loading) }"></walking-loader>
    <error-modal :error="error"></error-modal>
</div>
</template>

<script>
import http from '../helpers/http';
import WalkingLoader from './WalkingLoader.vue';
import ErrorModal from './ErrorModal.vue';
export default {
    data() {
        return {
            initialized: false,
            loading: false,
            error: null,
            times: [],
            snapshot: null
        }
    },
    methods: {
        loadTimes() {
            this.loading = true;
            this.error = null;
            return http.getJson('/api/snapshot/times')
                .then(t => this.times = t, err => this.error = err)
                .then(() => this.loading = false);
        },
        loadSnapshot(time) {
            this.loading = true;
            this.error = null;
            var url = time ? '/api/snapshot/' + time : '/api/snapshot';
            return http.getJson(url)
                .then(s => this.snapshot = s, err => this.error = err)
                .then(() => this.loading = false);
        }
    },
    filters: {
        prettyTime(v) {
            var d = new Date(v);
            return d.toString();
        }
    },
    created() {
        var sp = this.loadSnapshot();
        var tp = this.loadTimes();
        Promise.all([sp, tp]).then(() => this.initialized = true)
    },
    components: { WalkingLoader, ErrorModal }
}
</script>

<style>
.twitch-digits .error-modal {
    display: none;
}
.twitch-digits .error-modal.visible {
    display: block;
}
.twitch-digits .loader {
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.twitch-digits .loader.visible {
    display: block;
}
</style>
