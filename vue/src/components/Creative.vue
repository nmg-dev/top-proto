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
                        <svg width="100%" height="120px" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        </svg>
                    </div>
                </template>
            </div>
            <div class="row panel-charts">
                <template v-for="charting in chartings">
                    <div class="col-sm-12 col-md-6 col-lg-3" :key="charting.label">
                        <div class="creative-chart-link">
                            <a @click="showModal">자세히 보기 &gt;</a>
                        </div>
                        <div class="creative-chart-wrapper">
                            <h5>{{ charting.label }}</h5>
                            <!-- chart here -->
                            <div class="creative-chart">

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
export default {
    name: 'creative',
    methods: {
        showModal: function(ev) {
            window.console.log(ev);
            this.$refs['creative_details_modal'].show();
        }
    },
    data: function() {
        return {
            compositions : [
                { 'design.layout': '중앙', 'design.background': '단색-밝은색', 'design.objet': '일러스트', 'design.button': '없음',
                  'message.keytopic': '', 'message.keyword': '', 'message.trigger': '', 'message.adcopy': '' },
                { 'design.layout': '중앙', 'design.background': '단색-밝은색', 'design.objet': '일러스트', 'design.button': '없음',
                  'message.keytopic': '', 'message.keyword': '', 'message.trigger': '', 'message.adcopy': '' },
                { 'design.layout': '중앙', 'design.background': '단색-밝은색', 'design.objet': '일러스트', 'design.button': '없음',
                  'message.keytopic': '', 'message.keyword': '', 'message.trigger': '', 'message.adcopy': '' },
            ],
            chartings: [
                { label: '레이아웃', data: [] },
                { label: '배경', data: [] },
                { label: '오브제', data: [] },
                { label: '버튼', data: [] },
                { label: '주제', data: [] },
                { label: '키워드', data: [] },
                { label: '트리거', data: [] },
                { label: '카피', data: [] },
            ]
        }
    }
}
</script>