<template>
    <div class="section panel-details m-0">
        <div class="row section-title m-0 p-0">
            <div class="col p-0" align="left">
                <h3>크리에이티브 분석</h3>
                <h5>소재 요소 상세 분석</h5>
            </div>
        </div>
        <div class="row creative-previews">
            <template v-for="(comp, cidx) in compositions">
                <div class="col-sm-12 col-md-4" :key="cidx">
                    <h5>{{ cidx+1 }} 순위 조합</h5>
                    <!-- preview here -->
                    <preview :data="comp" style="width: 100%; height: 120px;" />
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
                        <h5>{{ lang(charting.cls) }} -{{ appMetric.label }}</h5>
                        <div class="creative-chart">
                            <vue-plotly height="200" 
                                :layout="chart_layout" 
                                :data="chart_values(charting.data)" />
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <b-modal size="lg" ref="creative-modal" class="creative-modal">
            <template slot="modal-header">
                <div class="d-block">
                    <h3 class="modal-title">{{ lang(this.details_cls) }} 세부 분석</h3>
                    <h5>크리에이티브 요소 분석</h5>
                </div>
                <button type="button" class="close" aria-label="Close" @click="$refs['creative-modal'].hide()"><span aria-hidden="true">×</span></button>
            </template>
            <template v-if="details">
                <div class="d-flex justify-content-end align-items-top">
                    <b-dropdown class="query-control m-0" variant="default" no-caret>
                        <template slot="button-content">
                            <div class="label-text text-muted">{{ details_tag ? details_tag.name : lang('all') }}</div>
                            <i class="fas fa-chevron-down m-0 p-0"></i>
                        </template>
                        <b-dropdown-item :data-tagid="null" @click="selectChartDetailTag">{{ lang('all') }}</b-dropdown-item>
                        <b-dropdown-divider />
                        <template v-for="tag in details_tags">
                            <b-dropdown-item :data-tagid="tag.id" @click="selectChartDetailTag">{{ tag.name }}</b-dropdown-item>
                        </template>
                    </b-dropdown>
                </div>
                <div>
                    <vue-plotly height="350" 
                        :layout="chart_detail_options" 
                        :data="chart_detail_values()" />
                </div>
                <div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>날짜</th>
                                <template v-for="met in metrices">
                                    <th :class="`${met.key==details_metric ? 'selected' : ''}`" :key="met.key" :data-metric="met.key" @click="selectChartDetailMetric" :title="met.label">{{ met.label }}</th>
                                </template>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="(label,ridx) in details.labels">
                                <tr :key="label">
                                    <td>{{ label }}</td>
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
            <template slot="modal-footer">&nbsp;</template>
        </b-modal>
    </div>
</template>

<script>
    import VuePlotly from '@statnett/vue-plotly'
    import preview from './preview';

    import utils from '../utils.js';
    import langs from '../langs.js';

    export default {
        name: 'creative',
        langs,
        components: {
            // apexchart,
            VuePlotly,
            preview,
        },
        methods: {
            showModal: function(ev) {
                let el = ev.currentTarget || ev.target;
                this.details_cls = el.dataset.cls;
                this.details_tag = null;
                this.$refs['creative-modal'].show();
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
                    chart: { toolbar: { show: false }, },
                    grid: { show: false },
                    plotOptions: { 
                        bar: { 
                            horizontal: true,
                            dataLabels: {
                                position: 'top',
                                maxItems: 5,
                                hideOverflowingLabels: false,
                            }
                        }
                    },
                    dataLabels: { 
                        enabled: true,
                        position: 'top',
                        textAnchor: 'end',
                        formatter: (v,opt) => data[opt.seriesIndex].tag.name,
                        style: {
                            colors: ['#20ade3', '#1f4e79', '#9dc3e6', '#d9d9d9', '#deebf7', '#002060'],
                        },
                        offsetX: '-1px',
                    },
                    fill: { colors: ['#20ade3', '#1f4e79', '#9dc3e6', '#d9d9d9', '#deebf7', '#002060'], },
                    xaxis: { 
                        categories: data.map((dv)=>dv.tag.name),
                        labels: { show: false }, 
                        axisBorder: { show: false },  
                        axisTicks: { show: false },
                    },
                    yaxis: {
                        labels: { show: false }, 
                        axisBorder: { show: false },  
                        axisTicks: { show: false },
                    },
                    legend: { show: false },
                    tooltip: {
                        x: { show: true },
                        y: { show: true, formatter: utils.getMetric().fmt },
                        marker: { show: false },
                    }
                };
                return ret;
            },
            chart_values: function(data) {
                let colors = ['#20ade3', '#1f4e79', '#9dc3e6', '#d9d9d9', '#deebf7', '#002060'];
                let opts = {
                    type: 'bar',
                    orientation: 'h',
                    showlegend: false,

                    hoverinfo: 'name+text',
                    textposition: 'inside',
                    contraintext: 'both',
                };
                let met = utils.getMetric();
                return data.map((dv, di)=>{
                    let c = colors[di % colors.length];
                    return {
                        x: [ dv.mean, ],
                        y: [ met.label ],
                        name: dv.tag.name,
                        text: dv.tag.name,
                        marker:{ color: c },
                        line: { color: c, width: 1 },

                        type: 'bar',
                        orientation: 'h',
                        showlegend: false,

                        hoverinfo: 'name+text',
                        textposition: 'inside',
                        contraintext: 'both',   
                    };
                });
            },
            chart_detail_values: function() {
                let values = this.details_selected[this.details_metric];
                return [{
                    x: this.details.labels,
                    y: values,
                    type: 'scatter',
                    mode: 'lines+markers',
                    line: { color: '#20ade3', },
                    marker: { color: '#20ade3' },
                }];
                //     y: ;
                // };
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
            chart_detail_options: function() {
                let metric = utils.getMetric(this.details_metric);
                return {
                    title: `${metric.label}: ${this.details_tag ? this.details_tag.name : '-'}`

                };
            },
            
            chart_layout: function(){
                return {
                    title: utils.getMetric().label,
                    xaxis: { visible: false },
                    yaxis: { visible: false },
                    autosize: true,
                };
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

<style>
    .card.panel .panel-details .section-title {
        border-bottom: 1px solid #f2f2f2;
    }

    .card.panel .panel-details .section-title h5 {
        font-size: var(--font-size-3);
        font-weight: 300;
    }

    .creative-chart svg {
        overflow: visible;
    }

    .card.panel .row.creative-previews {
        margin-top: var(--padding-3);
        margin-bottom: var(--padding-1);
    }
    .card.panel .row.creative-previews h5 {
        font-size: var(--font-size-1);
        font-weight: 700;
    }

    .card.panel .row.panel-charts {
        margin-top: var(--padding-3);
        margin-bottom: var(--padding-1);
    }

    .creative-chart-link {
        font-size: var(--font-size-0);
        font-weight: 500;
        text-align: right;
        color: var(--data-primary);
    }

    .card.panel .panel-details .creative-chart-wrapper {
        border: 1px solid #f2f2f2;
        border-radius: 2px;
        margin: 4px;
        padding: var(--padding-0);
        color: var(--font-light);
    }

    .card.panel .panel-details .creative-chart-wrapper h5 {
        font-size: var(--font-size-2);
        line-height: 1.5em;
        margin-bottom: 2.5rem;
        font-weight: 600;
        text-align: center;
    }

    .modal-content {
        padding: var(--padding-3);
    }
    .modal-header {
        padding: 0px;
    }
    .modal-header .close {
        padding: 0px;
        margin: 0px;
        font-size: var(--font-size-9);
        font-weight: 100;
        color: var(--font-light);
    }
    .modal-header h3.modal-title {
        text-transform: capitalize;
        font-size: var(--font-size-9);
        font-weight: 700;
        padding-bottom: .5em;
    }
    .modal-header h5.modal-subtitle {
        color: var(--font-normal);
        font-size: var(--font-size-3);
        font-weight: 300;
    }
    .creative-modal {
        margin: 0px;
        padding: 0px;
    }

    .creative-modal > div {
        margin-top: var(--padding-0);
    }

    .creative-modal .query-control {
        margin: 0px;
        padding: 0px;
        border: none;
    }

    .creative-modal .query-control button {
        margin-top: 0px;
        margin-bottom: 0px;
        margin-left: 10px;
        margin-right: 10px;
        padding-top: 2px;
        padding-bottom: 2px; 
        border-radius: 2px;
        border: 1px solid #d9d9d9;

        min-height: 32px;
        min-width: 10vw;

        padding-left: 12px;
        padding-right: 24px;
        text-align: left;
        width: 100%;
        line-height: 1.5em;
        line-break: unset;
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        font-size: var(--font-size-0);
        font-weight: 500;
    }

    .modal-body table.table {
        font-size: var(--font-size-0);
    }

    .modal-body table.table thead th {
        font-weight: 700;
        color: var(--font-normal);
        text-align: center;
        text-transform: capitalize;
        background-color: var(--bg-light);
        border: none;
        cursor: pointer;
    }
    .modal-body table.table thead .kpi-column {
        background-color: var(--data-primary);
        color: var(--font-white);
    }
    .modal-body table.table tbody .kpi-column {
        background-color: var(--bg-select);
    }

    .modal-body table.table tr td {
        font-weight: 300;
        color: var(--font-light);
        text-align: right;
        padding-top: .25rem;
        padding-bottom: .25rem;
        border-bottom: 1px solid #e9ecef;
    }
    .modal-body table.table tr td:first-child {
        text-align: center;
    }
    .modal-body table.table td.selected {
        background-color: var(--bg-select);
    }
    .modal-body table.table th.selected {
        color: var(--font-white);
        background-color: var(--data-primary);
    }

    .modal-body .dropdown.query-control {
        border: none;
    }

    .modal-body .query-control .btn-group {
        margin: 0px;
        padding: 0px;
    }

    .modal-body .query-control button.dropdown-toggle {
        display: flex; 
        justify-content: space-between;
        align-items: center;
        margin-top: 0px;
        margin-bottom: 0px;
        margin-left: 10px;
        margin-right: 10px;
        padding-top: 2px;
        padding-bottom: 2px;
        border-radius: 2px;
        border: 1px solid #d9d9d9;
        min-height: 32px;
        min-width: 10vw;
    }

    .modal-body .query-control button.dropdown-toggle .label-text {
        padding-left: 12px;
        padding-right: 24px;
        text-align: left;
        width: 100%;
        line-height: 1.5em;
        line-break: unset;
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        font-size: var(--font-size-0);
        font-weight: 500;
    }
</style>