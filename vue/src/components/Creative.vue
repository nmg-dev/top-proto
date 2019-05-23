<template>
    <div class="section panel-details">
        <div class="row section-title">
            <div class="col">
                <h3>Element Analysis</h3>
                <h5>소재 요소 상세 분석</h5>
            </div>
            <div class="row creative-previews">
                <template v-for="(comp, cidx) in compositions">
                    <div class="col-sm-12 col-md-4" :key="cidx">
                        <h5>{{ cidx+1 }} 순위 조합</h5>
                        <!-- preview here -->
                        <preview :data="comp" />
                    </div>
                </template>
            </div>
            <div class="row panel-charts">
                <template v-for="charting in chartings">
                    <div class="col-sm-12 col-md-6 col-lg-3" :key="charting.cls">
                        <div class="creative-chart-link">
                            <a @click="showModal">자세히 보기 &gt;</a>
                        </div>
                        <div class="creative-chart-wrapper">
                            <h5>{{ lang(charting.cls) }}</h5>
                            <div class="creative-chart">
                                <apexchart type="bar" height="300" :options="chart_options(charting.data)" :series="chart_values(charting.data)" />
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <b-modal ref="creative_details_modal">

        </b-modal>
    </div>
</template>

<script>
import apexchart from 'vue-apexcharts';
import preview from './preview';

import utils from '../utils.js';
import langs from '../langs.js';

export default {
    name: 'creative',
    langs,
    components: {
        apexchart,
        preview,
    },
    methods: {
        showModal: function(ev) {
            window.console.log(ev);
            this.$refs['creative_details_modal'].show();
        },
        lang: function(key) {
            return langs.ko[key];
        },
        chart_options: function(data) {
            let ret = {
                plotOptions: { bar: { horizontal: true }},
                dataLabels: { enabled: false },
                xaxis: { categories: data.map((dt)=>dt.tag.name) },
            };
            return ret;
        },
        chart_values: function(data) {
            let ret = [{data: data.map((dt) => dt.mean)}];
            window.console.log('chart values', data, ret);
            return ret;
        }
    },
    mounted() { window.console.log(this.compositions, this.chartings); },
    computed: {
        compositions: function() {
            return utils.creativeCombinations(3);
        },
        chartings: function() {
            return utils.creativeSummaryCharts(5);
        },

    },
    data: function() {
        return { };
    }
}
</script>