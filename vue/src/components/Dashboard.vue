<template>
    <div class="m-0 p-1">
        <div class="row panel-header">
            <div class="col">
                <h3 class="panel-title">Best Creative Element</h3>
            </div>
        </div>
        <div class="row dashboard-card-design">
            <template v-for="ref in design_references">
                <div class="section col-3" :key="ref.cls">
                    <h5 class="section-title class-design">{{ lang(ref.cls) }}</h5>
                    <div class="section-text">{{ ref.name }}</div>
                </div>
            </template>
        </div>
        <div class="row dashboard-card-message">
            <template v-for="ref in message_references">
                <div class="section col-3" :key="ref.cls">
                    <h5 class="section-title class-message">{{ lang(ref.cls) }}</h5>
                    <div class="section-text">{{ ref.name }}</div>
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
                                    <th v-for="cls in preset_design_cls">{{ pv.options[cls] }}</th>
                                    <th v-for="cls in preset_message_cls">{{ pv.options[cls] }}</th>
                                </tr>
                                <tr>
                                    <th>CPC</th>
                                    <td class="cell-value" align="center" :colspan="Object.keys(pv.options).length">
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
        toolbar: { show: true },
    },
    plotOptions: {
        line: { curve: 'smooth' },
    },
    dataLabels: { enabled: true },
    grid: {},
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
        let best = utils.bestPracticeOver();
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
        preset_design_cls: function() { return utils.getPresetDesignClasses() },
        preset_message_cls: function() { return utils.getPresetMessageClasses() },
        chart_options: function() {
            return Object.assign(CHART_OPTIONS, {
                xaxis: {
                    categories: this.chart_series.map((ser)=>ser.label),
                },
                yaxis: {
                    labels: { formatter: utils.getMetric().fmt },
                }
            });
        },
        chart_data: function() {
            // window.console.log(utils.getMetric());
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
/* dashboard screen specific */
div.panel-category-detail {
    margin-top: 12px;
    margin-bottom: 24px;
}

div.panel-category-detail h5 {
    font-weight: 700;
    line-height: 2.5em;
}

.card.panel a {
    cursor: pointer;
}

.card.panel .row.dashboard-card-design,
.card.panel .row.dashboard-card-message
 {
    padding-left: 5vw;
    padding-right: 5vw;
    word-break: keep-all;
    white-space: nowrap;
    overflow: visible;
}
.card.panel .row.dashboard-card-chart {
    margin-top: var(--padding-5);
    padding: 0px;
    /* border: 1px solid #979797;
    background-color: #d8d8d8; */
}
.card.panel .row.dashboard-card-message {
    margin-bottom: var(--padding-1);
}
.card.panel .row.dashboard-card-chart
 {
    margin-bottom: var(--padding-5);
}

.card.panel .row.dashboard-card-table .section-title {
    padding: 0px;
    line-height: 2.0em;
    border-bottom: 1px solid #595959;
}

.card.panel .panel-details h3 {
    font-size: var(--font-size-8);
}
.card.panel .panel-details h5 {
    font-weight: 700;
    font-size: var(--font-size-5);
}

.card.panel .panel-details table.table {
    font-size: var(--font-size-1);
}

.card.panel .panel-details thead {
    background-color: var(--bg-light);
    border-top: 2px solid var(--data-grey);
    text-transform: capitalize;
}
.card.panel .panel-details tr {
    border-bottom: 1px solid var(--data-grey);
}
.card.panel .panel-details th {
    padding: 0.24rem;
    min-width: 5vw;
    font-weight: 700;

    text-align: center;
    vertical-align: middle;
}
.card.panel .panel-details tbody td {
    font-weight: 400;
    text-align: right;
}
.card.panel .panel-details tbody td.class-design {
    background-color: var(--bg-select);
}
.card.panel .panel-details tbody td.cell-value {
    text-align: center;
}
</style>