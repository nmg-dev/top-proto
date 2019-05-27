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
                            <a :data-cls="charting.cls" @click="showModal">자세히 보기 &gt;</a>
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
        <b-modal size="lg" ref="creative_details_modal" 
            :title="`${lang(this.details_cls)} details`"
            subtitle="크리에이티브 요소 상세분석">
            <template v-if="details">
                <div class="d-flex justify-content-end align-items-top">
                    <b-dropdown class="query-btn" no-caret
                        :text="details_tag ? details_tag.name : 'ALL'">
                        <b-dropdown-item :data-tagid="null" @click="selectChartDetailTag">ALL</b-dropdown-item>
                        <template v-for="tag in details_tags">
                            <b-dropdown-item :data-tagid="tag.id" @click="selectChartDetailTag">{{ tag.name }}</b-dropdown-item>
                        </template>
                    </b-dropdown>
                </div>
                <div>
                    <apexchart type="line" height="350" 
                        :options="chart_detail_options" 
                        :series="[{name: chart_detail_title, data: chart_detail_values}]" />
                </div>
                <div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>날짜</th>
                                <template v-for="met in metrices">
                                    <th v-if="met===appMetric" :class="`${met.key==details_metric ? 'selected' : ''}`" :key="met.key" :data-metric="met.key" @click="selectChartDetailMetric">{{ met.label }}</th>
                                    <th v-else :key="met.key" :class="`${met.key==details_metric ? 'selected' : ''}`" :data-metric="met.key" @click="selectChartDetailMetric">{{ met.label }}</th>
                                </template>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="(label,ridx) in details.labels">
                                <tr :key="label">
                                    <th>{{ label }}</th>
                                    <template v-for="met in metrices">
                                        <td v-if="met.key==details_metric" :key="`${label}-${met.key}`" class="selected">{{ met.fmt(details_selected[met.key][ridx]) }}</td>
                                        <td v-else :key="`${label}-${met.key}`">{{ met.fmt(details_selected[met.key][ridx]) }}</td>
                                    </template>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </template>
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
            let el = ev.currentTarget || ev.target;
            this.details_cls = el.dataset.cls;
            this.details_tag = null;
            this.$refs['creative_details_modal'].show();
        },
        selectChartDetailTag: function(ev) {
            let el = ev.currentTarget || ev.target;
            let tagid = el.dataset.tagid;

            if(parseInt(tagid)) {
                this.details_tag = this.details.values.filter((dv)=>dv.t == tagid)[0].tag;
            } else {
                this.details_tag = null;
            }
        },
        selectChartDetailMetric: function(ev) {
            let el = ev.currentTarget || ev.target;
            let mk = el.dataset.metric;
            this.details_metric = mk;
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
            return ret;
        },
        
        
    },
    mounted() {  },
    computed: {
        compositions: function() {
            return utils.creativeCombinations(3);
        },
        chartings: function() {
            return utils.creativeSummaryCharts(5);
        },
        appMetric: function() {
            return utils.getMetric();
        },
        metrices: function() {
            return utils.metrices.filter((m) => !m.defaultHide);
        },
        details: function() {
            return this.details_cls ? utils.creativeDetailChart(this.details_cls) : null;
        },
        details_tags: function() {
            return this.details.values
                .filter((dv,idx) => 0<idx)
                .map((dv)=>dv.tag);
        },
        details_selected: function() {
            if(!this.details_tag) {
                return this.details.values[0].data;
            } else {
                return this.details.values
                    .filter((dvs) => dvs.t == this.details_tag.id)[0]
                    .data;
            }
        },
        chart_detail_title: function() {
            return `${this.lang(this.details_cls)}`
                + `:${this.details_tag ? this.details_tag.name : '-ALL'}`
                + `[${this.details_metric}]`;
        },
        chart_detail_options: function() {
            return {
                chart: {
                    height: 350,
                    zoom: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight'
                },
                grid: {
                },
                xaxis: {
                    categories: this.details.labels,
                },
            };
        },
        chart_detail_values: function(data) {
            return this.details_selected[this.details_metric];
        },
    },
    data: function() {
        return { 
            details_cls: null,
            details_tag: null,
            details_metric: utils.getMetric().key,
        };
    }
}
</script>