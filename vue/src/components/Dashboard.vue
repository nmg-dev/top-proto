<template>
    <div className="m-0 p-1">
        <div className="row panel-header">
            <div className="col">
                <h3 className="panel-title">Best Creative Element</h3>
            </div>
        </div>
        <div className="row dashboard-card-design">
            <template v-for="design_att in design_attrs">

            </template>
        </div>
        <div className="row dashboard-card-message">
            

        </div>
        <div className="row dashboard-card-chart">
            <div className="col">
            </div>
        </div>
        <div className="row dashboard-card-table panel-details">
            <div className="col">
                <h3 className="section-title">Element Analysis</h3>
            </div>
        </div>
    </div>
</template>

<script>
import './appscreen.css';
export default {
    name: 'dashboard',
    props: [
        'design_attrs',
        'message_attrs',
    ],
    data: () => {
        return {

        }
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