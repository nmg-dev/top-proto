<template>
    <div class="querybar-top d-flex justify-content-between">
        <div class="querybar-title d-flex justify-content-start align-items-center">
            <h1><b>C</b>reative <b>O</b>ptimization <b>S</b>ystem</h1>
            <sup style="color: var(--data-primary);">Beta</sup>
        </div>
        <div class="querybar-controls d-block" v-if="controls">
            <!-- period control -->
            <b-input-group class="query-control top-control">
                <daterange 
                    :from="period.from"
                    :till="period.till"
                    @periodUpdated="set_app_period">
                </daterange>
            </b-input-group>

            <!-- dropdown metric -->
            <b-input-group class="query-control top-control">
                <b-dropdown variant="default" no-caret>
                    <template slot="button-content">
                        <div class="label-icon m-0 p-0">
                            <img src="../assets/icon-metric.png" alt="app metric" />
                        </div>
                        <div class="label-text text-muted">{{ app_metric.label }}</div>
                        <i class="fas fa-chevron-down align-self-start" />
                    </template>
                    <template v-for="met in metrices">
                        <b-dropdown-item 
                            :key="met.key" 
                            :title="met.desc" 
                            :checked="met.key === app_metric.key"
                            @click="set_app_metric(met.key)"
                            v-if="!met.defaultHide">{{ met.label }}
                        </b-dropdown-item>
                    </template>
                </b-dropdown>
            </b-input-group>
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
            this.$emit('refreshUpdate');
        },
        set_app_period: function(period) {
            // reload campaigns
            utils.retrieveCampaigns(true);
            this.$emit('refreshUpdate');
        },
    },
    // beforeMount: function() {
    //     this.appMetric = this.$root.metric;
    // },
    mounted: function() {
    },
    updated: function() {
    }
}
</script>

<style>
@import 'https://nmg-dev.github.io/bs-daterange/daterange.css';


</style>