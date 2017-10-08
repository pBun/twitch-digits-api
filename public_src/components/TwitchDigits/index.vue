<template>
<div class="twitch-digits" :class="{ 'loading': loading || error }">
    <div class="twitch-digits-main">
        <h2 class="chart-label">viewership as of {{ prettyTime }}</h2>
        <div class="snapshot-chart-wrapper">
            <snapshot-chart :snapshot="snapshot"></snapshot-chart>
        </div>
    </div>
    <snapshot-menu :times="times" :selected="selectedTime" @linkClick="refresh"></snapshot-menu>
    <walking-loader class="loader" :class="{ 'visible': (!initialized || loading) }"></walking-loader>
    <error-modal :error="error"></error-modal>
</div>
</template>

<script>
import http from '../../helpers/http';
import moment from 'moment';
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
            selectedTime: null,
            now: null,
            snapshot: null
        }
    },
    computed: {
        prettyTime(scope) {
            var t = scope.selectedTime;
            if (!t) return 'now';
            var diff = moment().diff(moment(t));
            var dur = moment.duration(diff);
            var d = Math.floor(dur.asDays());
            var h = Math.round(dur.asHours() - d * 24);
            return (d ? d + 'd ' : '') + (h ? h + 'h' : 'a few minutes') + ' ago';

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
                    this.selectedTime = time;
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
    height: 100%;
}
.twitch-digits .chart-label {
    margin-bottom: 1em;
}
.twitch-digits .error-modal {
    display: none;
}
.twitch-digits .error-modal.visible {
    display: block;
}
.twitch-digits .twitch-digits-main {
    opacity: 1;
    transition: 0.3s opacity;
    height: 100%;
    position: relative;
}
.twitch-digits.loading .twitch-digits-main {
    opacity: 0;
}
.twitch-digits .snapshot-chart-wrapper {
    height: 80%;
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
