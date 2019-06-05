<template>
    <div class="section panel-details">
        <div class="row section-title p-0 m-0">
            <div class="col m-0 p-0" align="left">
                <h3 class="title">Creative Simulation</h3>
                <h5 class="subtitle">소재요소별 예상효율 확인</h5>
            </div>
        </div>
        <div class="row section-content simulate-options">
            <div class="col col-sm-12 col-lg-4 p-4" v-for="mcls in classes" :key="mcls.c">
                <table class="table simulate-table" v-if="0<options[mcls.c].length">
                    <thead>
                        <tr>
                            <th>{{ mcls.label }}</th>
                            <th colspan="2">옵션</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="opts in options[mcls.c]" :key="opts.label">
                            <th>{{ lang(opts.cls) }}</th>
                            <td>
                                <b-dropdown :key="`${mcls.c}-${opts.cls}`" no-caret variant="default" right style="width: 100%">
                                    <template slot="button-content" class="d-flex justify-content-between">
                                        <span v-if="selecteds[opts.cls]" style="color: var(--data-primary); font-weight: 500;">
                                            {{ tagName(selecteds[opts.cls]) }}
                                        </span>
                                        <span v-else>
                                            전체선택
                                        </span>
                                        <i class="fas fa-chevron-down"></i>
                                    </template>
                                    <b-dropdown-item :data-cls="opts.cls" :data-tagid="-1" @click="addOpts" value="">전체선택</b-dropdown-item>
                                    <b-dropdown-divider />
                                    <b-dropdown-item :checked="selecteds[opts.cls] == tag.id" :data-cls="opts.cls" :data-tagid="tag.id" @click="addOpts" v-for="tag in opts.tags" :key="`simulate-opt-${tag.id}`" :value="tag.id">{{ tag.name }}</b-dropdown-item>
                                </b-dropdown>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="row section-controls">
            <div class="col" align="right" v-if="sims.length<=0">
                <b-button variant="default" @click="resetOpts">리셋</b-button>
                <b-button variant="default" @click="addSims">예상효율 확인하기</b-button>
            </div>
            <div class="col" align="right" v-else>
                <b-button variant="default" @click="addSims">다시 확인하기</b-button>
            </div>
        </div>
        <div class="printable section-result">
            <h3 class="section-result-title">Result</h3>
            <div class="row section-result" v-for="(sim,sidx) in sims" :key="`simulate-${sidx}`">
                <div class="col-lg-8 col-md-12 p-0">
                    <div class="simulate-option">
                        <template v-if="sim && 0<Object.keys(sim).length">
                            <template v-for="(cls,cidx) in Object.keys(sim.options)">
                                <span v-if="0<cidx">•</span>
                                <span :title="`${lang(cls)}:${tagName(sim.options[cls])}`">
                                    {{tagName(sim.options[cls])}}
                                </span>
                            </template>
                        </template>
                        <template v-else>
                            ALL
                        </template>
                    </div>
                    <table class="simulate-result">
                        <thead>
                            <tr>
                                <th v-for="met in metrices" :key="met.key">
                                    e.{{ met.label }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td v-for="met in metrices" :key="met.key">
                                    {{ met.fmt(sim.result[met.key]) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import utils from '../utils.js';
import langs from '../langs.js';

export default {
    name: 'simulation',
    methods: {
        lang: function(key) { return langs.ko[key] || key; },
        tagName: function(tid) { return this.tags[tid].name }, 
        resetOpts: function() {
            this.selecteds = {};
            this.$forceUpdate();
        },
        addSims: function() {
            let options = Object.assign({}, this.selecteds);
            let result = utils.simulationResults(options);
            this.sims.unshift({
                options,
                result,
            });
            this.$forceUpdate();
        },
        addOpts: function(ev) {
            let el = ev.currentTarger || ev.target;
            let cls = el.dataset.cls;
            let tid = el.dataset.tagid;
            if(tid<0) {
                delete this.selecteds[cls];
            }
            else {
                this.selecteds[cls] = tid;
            } 
            this.$forceUpdate();
        },
    },
    data: function() {
        return {
            metrices: utils.metrices.filter((m)=>!m.defaultHide),
            tags: utils.retrieveTags(),
            classes: [
                {c: 'designs', label: '디자인 속성' },
                {c: 'content', label: '컨텐츠 속성' },
                {c: 'campaigns', label: '캠페인 속성' },
                {c: 'others', label: '기타 속성'},
            ],
            options: utils.simulationOptionValues(),
            selecteds: {},
            sims: [],
        }
    }
}
</script>

<style>
.card.panel .section-title {
    font-weight: 700;
    font-size: var(--font-size-7);
    padding: var(--padding-1);
    margin-top: var(--padding-1);
}
.card.panel .panel-details .section-title .subtitle {
    font-size: var(--font-size-2);
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
}

.card.panel .panel-details .section-content {
    margin-top: var(--padding-5);
    margin-bottom: var(--padding-2);
}

.card.panel .panel-details table.table.simulate-table thead {
    background-color: transparent;
    border: none;
}

.card.panel .panel-details table.table.simulate-table thead th {
    padding-left: 1vw;
    padding-right: 1vw;
    text-align: left;
    background-color: transparent;
    border: none;
}

.card.panel .panel-details table.table.simulate-table tbody th {
    padding: 0px;
    text-align: left;
    font-weight: 300;
    font-size: var(--font-size-0);
    vertical-align: middle;
}

.card.panel .panel-details table.table.simulate-table tbody td {
    padding: 0px;
    text-align: center;
    vertical-align: middle;
    font-size: var(--font-size-0);
}


.card.panel .panel-details table.table.simulate-table tbody td .btn-group > .btn {
    font-size: var(--font-size-0);
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 7.5vw;
}

.card.panel .panel-details table.table.simulate-table tbody td ul.dropdown-menu a.dropdown-item[checked] {
    color: var(--data-primary);
    background-color: var(--bg-select);
}

.card.panel .section-content.simulate-options > div.col:first-child table.simulate-table tbody {
    background-color: var(--bg-light);
}
.card.panel .section-result .section-result-title {
    text-align: left;
    margin-top: -2.5rem;
}

.card.panel .section-result .simulate-option {
    text-align: left;
    display: block;
    margin-top: 1.5em;
    margin-bottom: 1.0em;
    font-size: 0.5em;
    font-weight: 300;
}

.card.panel .section-result table.simulate-result {
    width: 100%;
}

.card.panel .section-result table.simulate-result th:first-child,
.card.panel .section-result table.simulate-result td:first-child {
    border-left: none;
}

.card.panel .section-result table.simulate-result th:last-child,
.card.panel .section-result table.simulate-result td:last-child {
    border-right: none;
}

.card.panel .section-result table.simulate-result thead th {
    text-align: left;
    text-transform: none;
    text-indent: 1.0em;
    background-color: #d8d8d8;
    min-width: 9vw;
    border-top: 1px solid #979797;
    border-bottom: 1px solid #979797;
    border-left: 1px solid #979797;
    border-right: 1px solid 
}

.card.panel .section-result table.simulate-result td {
    font-size: var(--font-size-1);
    padding: .75rem;
    vertical-align: top;
    min-width: 9vw;
    border-left: 1px solid #979797;
    border-right: 1px solid #979797;
    font-weight: 400;
    text-align: right;
}

.card.panel .panel-details .section-controls button.btn {
    min-width: 10vw;
    font-size: var(--font-size-1);
    font-weight: 700;
    border: 2px solid #979797;
    border-radius: 8px;
    margin-top: var(--padding-2);
    margin-left: var(--padding-1);
    height: var(--padding-3);
}
</style>