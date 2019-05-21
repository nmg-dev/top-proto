<template>
    <div class="querybar-top">
        <div class="querybar-title d-flex justify-content-start align-items-center">
            <h1>Tag Operation</h1>
            <sup>Beta</sup>
        </div>
        <div class="querybar-controls" v-if="controls">
            <!-- dropdown metric -->
            <b-input-group>
                <b-input-group-text>
                    <img src="../assets/icon-metric.png" alt="ruler" />
                </b-input-group-text>
                <b-input-group-text>{{ app_metric.label }}</b-input-group-text>
                <b-dropdown>
                    <template v-for="met in metrices">
                        <b-dropdown-item :key="met.key" :title="met.desc" 
                            @click="set_app_metric(met.key)"
                            v-if="!met.defaultHide">{{ met.label }}
                        </b-dropdown-item>
                    </template>
                </b-dropdown>
            </b-input-group>
            
            <!-- period control -->
            <daterange 
                :from="period.from"
                :till="period.till">
            </daterange>
        </div>
    </div>
</template>

<script>
import utils from '../utils.js';

import daterange from './daterange';

export default {
    name: 'querytop',
    props: ['controls'],
    components: {
        daterange,
    },
    computed: {
        metrices: function() { 
            return utils.metrices; 
        },
    },
    data: () => {
        return {
            app_metric: utils.getMetric(),
            period: utils.getPeriod(),
        };
    },
    methods: {
        set_app_metric: function(metric) {
            utils.setMetric(metric);
            this.app_metric = utils.getMetric();
        }
    },
    // beforeMount: function() {
    //     this.appMetric = this.$root.metric;
    // },
    mounted: function() {
    },
    updated: function() {
        window.console.log(this.app_metric);
    }
}
</script>

<style>
@import 'https://nmg-dev.github.io/bs-daterange/daterange.css';
</style>