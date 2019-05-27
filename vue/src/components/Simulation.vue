<template>
    <div class="section panel-details">
        <div class="row section-title">
            <h3 class="title">Creative Simulation</h3>
            <h5 class="subtitle">소재요소별 예상효율 확인</h5>
        </div>
        <div class="row section-content">
            <div class="col-sm-12 col-lg-4">
                <template v-for="mcls in classes">
                    <table class="table simulate-table" v-if="0<options[mcls.c].length">
                        <thead>
                            <tr>
                                <th>{{ mcls.label }}</th>
                                <th colspan="2">옵션</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="opts in options[mcls.c]">
                                <th>{{ lang(opts.cls) }}</th>
                                <td>
                                    <template v-if="selecteds[opts.cls]">
                                        <b-badge variant="light">{{ tagName(selecteds[opts.cls]) }}</b-badge>
                                    </template>
                                    <template v-else>
                                        ALL
                                    </template>
                                </td>
                                <td>
                                    <b-dropdown :key="`${mcls.c}-${opts.cls}`">
                                        <b-dropdown-item :data-cls="opts.cls" :data-tagid="-1" @click="addOpts" value="">ALL</b-dropdown-item>
                                        <b-dropdown-item :data-cls="opts.cls" :data-tagid="tag.id" @click="addOpts" v-for="tag in opts.tags" :key="`simulate-opt-${tag.id}`" :value="tag.id">{{ tag.name }}</b-dropdown-item>
                                    </b-dropdown>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </template>
            </div>
        </div>
        <div class="row section-controls">
            <div class="col" align="right">
                <b-button @click="resetOpts">리셋</b-button>
                <b-button @click="addSims">예상효율 확인하기</b-button>
            </div>
        </div>
        <div class="row section-result" v-for="sim in sims">
            <div class="col">
                <div class="sim-options">
                    <template v-if="0<Object.keys(sim).length">
                        <b-badge v-for="cls in Object.keys(sim.options)" :key="`simopt-${cls}`">
                            {{ lang(cls) }}: {{ tagName(sim.options[cls]) }}
                        </b-badge>
                    </template>
                    <template v-else>
                        ALL
                    </template>
                </div>
                <table class="sim-results">
                    <thead>
                        <tr>
                            <th v-for="met in metrices">
                                {{ met.label }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td v-for="met in metrices">
                                {{ met.fmt(sim.result[met.key]) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
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
        resetOpts: function(ev) {
            this.selecteds = {};
            this.$forceUpdate();
        },
        addSims: function(ev) {
            let options = Object.assign({}, this.selecteds);
            let result = utils.simulationResults(options);
            this.sims.push({
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