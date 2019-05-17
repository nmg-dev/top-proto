<template>
    <div className="m-0 p-1">
        <div className="row panel-header">
            <div className="col">
                <h3 className="panel-title">Best Creative Element</h3>
            </div>
        </div>
        <div className="row dashboard-card-design">
            <template v-for="ref in design_references">
                <div class="section col-3" :key="ref.cls">
                    <h5 class="section-title class-design">{{ ref.label }}</h5>
                    <div class="section-text">{{ ref.name }}</div>
                </div>
            </template>
        </div>
        <div className="row dashboard-card-message">
            <template v-for="ref in message_references">
                <div class="section col-3" :key="ref.cls">
                    <h5 class="section-title class-message">{{ ref.label }}</h5>
                    <div class="section-text">{{ ref.name }}</div>
                </div>
            </template>
        </div>
        <div className="row dashboard-card-chart">
            <div className="col">
                <apexchart type="line" height="500" :options="chart_options" :series="chart_data">
                </apexchart>
            </div>
        </div>
        <div className="row dashboard-card-table panel-details">
            <div className="col">
                <h3 className="section-title">Element Analysis</h3>
                <template v-for="pv in previews">
                    <div class="panel-category-detail" >
                        <h5>{{ pv.title }}</h5>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>속성</th>
                                    <th v-for="att in pv.options">{{ att.label }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>옵션</th>
                                    <td v-for="att in pv.options">{{ att.name }}</td>
                                </tr>
                                <tr>
                                    <th>CPC</th>
                                    <td class="cell-value" align="center" :colspan="pv.options.length">
                                        {{ pv.average }}
                                    </td>
                                </tr>
                                <tr>
                                    <th>예시</th>
                                    <td :colspan="pv.options.length">
                                        <!-- TODO: preview -->
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

import './appscreen.css';

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



export default {
    name: 'dashboard',
    props: [
        'design_attrs',
        'message_attrs',
    ],
    data: () => {
        return {
            design_references: sample_design_refers,
            message_references: sample_message_refers,
            previews: [
                {title: '게임', options: sample_design_refers.concat(sample_message_refers), average: Math.random()*100 },
                {title: '금융', options: sample_design_refers.concat(sample_message_refers), average: Math.random()*100 },
                {title: '샘플', options: sample_design_refers.concat(sample_message_refers), average: Math.random()*100 },
            ],
            chart_options: {
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
                markers: { size: 4 },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        datetimeFormatter: {
                            year: 'yyyy',
                            month: 'MMM',
                            day: 'dd',
                            hour: 'HH:mm',
                        }
                        /* formatter: '' */
                    }
                },
                yaxis: {
                    labels: { formatter: (v) => `${(v*100).toFixed(2)}%` },
                },
                legend: {
                },
            },
            chart_data: [{
                name: 'CPC',
                data: [...new Array(3*365)].map(
                    (v,idx)=> [Date.now() - (365-idx)*datelen_a_day, Math.random()*100]
                )
            }],
        }
    },
    components: {
        apexchart,
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