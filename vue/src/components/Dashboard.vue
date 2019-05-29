<template>
    <div class="m-0 p-1">
        <div class="row panel-header">
            <div class="col">
                <h3 class="panel-title">Best Creative Element</h3>
            </div>
        </div>
        <div class="row dashboard-card-design">
            <template v-for="ref in design_references">
                <div class="section col-3" :key="ref.cls" v-b-tooltip.hover :title="`${lang(ref.cls)}: ${ref.name}`">
                    <h5 class="section-title class-design">{{ ref.name }}</h5>
                    <div class="section-text">{{ lang(ref.cls) }}</div>
                </div>
            </template>
        </div>
        <div class="row dashboard-card-message">
            <template v-for="ref in message_references">
                <div class="section col-3" :key="ref.cls" v-b-tooltip.hover :title="`${lang(ref.cls)}: ${ref.name}`">
                    <h5 class="section-title class-message">{{ ref.name }}</h5>
                    <div class="section-text">{{ lang(ref.cls) }}</div>
                </div>
            </template>
        </div>
        <div class="row dashboard-card-chart">
            <div class="col">
                <apexchart type="line" height="500" :options="chart_options" :series="chart_data">
                </apexchart>
            </div>
        </div>
        <div class="row dashboard-card-table panel-details">
            <div class="col">
                <h3 class="section-title">Element Analysis</h3>
                <template v-for="pv in previews">
                    <div class="panel-category-detail" :key="pv.title">
                        <h5>{{ pv.title }}</h5>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>속성</th>
                                    <th v-for="cls in preset_design_cls">{{ lang(cls) }}</th>
                                    <th v-for="cls in preset_message_cls">{{ lang(cls) }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>옵션</th>
                                    <td v-for="cls in preset_design_cls" class="class-design">{{ pv.options[cls] }}</td>
                                    <td v-for="cls in preset_message_cls" class="class-message">{{ pv.options[cls] }}</td>
                                </tr>
                                <tr>
                                    <th>{{ app_metric }}</th>
                                    <td class="cell-value class-design" align="center" :colspan="Object.keys(pv.options).length">
                                        {{ pv.average }}
                                    </td>
                                </tr>
                                <tr>
                                    <th>예시</th>
                                    <td :colspan="Object.keys(pv.options).length">
                                        <preview :data="pv.options" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import apexchart from 'vue-apexcharts'
import preview from './preview';

import './appscreen.css';
import utils from '../utils.js';
import langs from '../langs.js';

const datelen_a_day = 86400000;
const sample_design_refers = [
    { cls: 'design.layout', name: '중앙', label: '레이아웃' },
    { cls: 'design.objet', name: '일러스트', label: '오브제' },
    { cls: 'design.background', name: '단색-밝은색', label: '배경' },
    { cls: 'design.button', name: '없음', label: '버튼' },
];
const sample_message_refers = [
    { cls: 'message.keytopic', name: '특가', label: '주제' },
    { cls: 'message.keyword', name: '할인', label: '키워드' },
    { cls: 'message.trigger', name: '설득형', label: '트리거' },
    { cls: 'message.adcopy', name: '제시', label: '카피' },
];
const CHART_OPTIONS = {
    chart: {
        stacked: false,
        zoom: { type: 'x', enabled: true },
        toolbar: { show: false },
    },
    plotOptions: {
        line: { curve: 'smooth' },
    },
    dataLabels: { 
        enabled: true,
    },
    grid: { show: true },
    markers: { size: 1 },
    xaxis: {
        // type: 'datetime',
        // labels: {},
    },
    yaxis: {
        // labels: { formatter: utils.getMetric().fmt },
    },
    legend: {
    },
};


export default {
    name: 'dashboard',
    props: [
        'language',
    ],
    data: () => {
        let best = utils.bestPracticeOver(utils.getFilter());
        // let tops = utils.topOptionOverPractice(best);

        return {
            tagfilters: null,
            best_practices: best,
            previews: utils.dashboardPreviews(),
            design_references: utils.dashboardDesignRefers(best),
            message_references: utils.dashboardMessageRefers(best),
            chart_series: utils.dashboardSeries(),
        }
    },
    watch: {
        best_practices: function(best) {
            this.design_references = utils.dashboardDesignRefers(best);
            this.message_references = utils.dashboardMessageRefers(best);
            this.previews = utils.dashboardPreviews(this.tagfilters);
        },

    },
    computed: {
        app_metric: function() { return utils.getMetric().label; },
        preset_design_cls: function() { return utils.getPresetDesignClasses() },
        preset_message_cls: function() { return utils.getPresetMessageClasses() },
        chart_options: function() {
            return Object.assign(CHART_OPTIONS, {
                xaxis: {
                    categories: this.chart_series.map((ser)=>ser.label),
                },
                yaxis: {
                    labels: { formatter: utils.getMetric().fmt },
                },
                dataLabels: {
                    enabled: true,
                    formatter: (v) => utils.getMetric().fmt(v),
                }
            });
        },
        chart_data: function() {
            return [{
                name: utils.getMetric().label,
                data: this.chart_series.map((ser) => ser.value),
            }];
        },
    },
    methods: {
        lang: function(key) {
            return langs[this.language][key];
        },
    },
    created() { utils.retrieveCampaigns(); },
    components: {
        apexchart,
        preview,
    }
}
</script>

<style>
    .card.panel .section-title {
		text-align: center;
		font-weight: 700;
		font-size: var(--font-size-6);
		margin-top: var(--padding-1);
		padding: 0px;
	}

</style>