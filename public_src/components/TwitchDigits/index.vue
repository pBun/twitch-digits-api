<template>
<div class="twitch-digits">
    <snapshot-chart :snapshot="snapshot" :time="selected" :class="{ 'loading': loading || error }"></snapshot-chart>
    <snapshot-menu :times="times" :selected="selected" @linkClick="refresh"></snapshot-menu>
    <walking-loader class="loader" :class="{ 'visible': (!initialized || loading) }"></walking-loader>
    <error-modal :error="error"></error-modal>
</div>
</template>

<script>
import http from '../../helpers/http';
import WalkingLoader from './WalkingLoader.vue';
import ErrorModal from './ErrorModal.vue';
import SnapshotMenu from './SnapshotMenu.vue';
import SnapshotChart from './SnapshotChart/index.vue';
export default {
    data() {
        return {
            initialized: false,
            loading: false,
            error: null,
            times: [],
            selected: null,
            now: null,
            snapshot: null
        }
    },
    methods: {
        refresh(time) {
            return this.loadSnapshot(time)
                .then(() => this.loadTimes());
        },
        setNow(s) {
            this.now = {
                'viewers': s.viewers,
                'channels': s.channels
            };
        },
        loadTimes() {
            this.loading = true;
            this.error = null;
            return http.getJson('/api/snapshot/times')
                .then(t => {
                    t.push(this.now);
                    this.times = t;
                }, err => this.error = err)
                .then(() => this.loading = false);
        },
        loadSnapshot(time) {
            this.loading = true;
            this.error = null;
            var url = time ? '/api/snapshot/' + time : '/api/snapshot';
            return http.getJson(url)
                .then(s => {
                    this.selected = time;
                    if (!time) this.setNow(s);
                    this.snapshot = s
                }, err => this.error = err)
                .then(() => this.loading = false);
        }
    },
    created() {
        this.refresh().then(() => this.initialized = true);
    },
    components: { SnapshotChart, WalkingLoader, ErrorModal, SnapshotMenu }
}
</script>

<style>
.twitch-digits {
    height: 90%;
}
.twitch-digits .error-modal {
    display: none;
}
.twitch-digits .error-modal.visible {
    display: block;
}
.twitch-digits .chart-wrapper {
    opacity: 1;
    transition: 0.3s opacity;
}
.twitch-digits .chart-wrapper.loading {
    opacity: 0;
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
