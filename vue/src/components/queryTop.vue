<template>
    <div class="querybar-top">
        <div class="querybar-title d-flex justify-content-start align-items-center">
            <h1>Tag Operation</h1>
            <sup>Beta</sup>
        </div>
        <div class="querybar-controls" v-if="controls">
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
            
            <!-- period control -->
            <b-input-group class="query-control top-control">
                <daterange 
                    :from="period.from"
                    :till="period.till"
                    @periodUpdated="set_app_period">
                </daterange>
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

.querybar .querybar-top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    min-height: 90px;
}
.query-control.top-control {
    margin: var(--padding-1);
    margin-left: 0px;
    border-radius: 0;
    color: var(--font-light);
    min-width: 12vw;
}
.query-control.top-control button {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    border: 1px solid #d9d9d9;
    border-radius: 1px;
    box-shadow: none;
    padding-top: 2px;
    padding-bottom: 2px;
    background-color: var(--bg-white);
}
</style>