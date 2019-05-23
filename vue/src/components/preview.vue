<template>
    <svg class="creative-preview" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <!-- background image -->
        <image x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" :href="background" />
        <!-- objet image -->
        <image :x="objet_layout.x" :y="objet_layout.y" :height="objet_layout.h" preserveAspectRatio :href="objet_href" />
        <!-- content text -->
        <template v-if="text_layout == '좌우'">
            <text x="75%" y="50%" fill="grey">{{ text }}</text>
            <text x="5%" y="50%" fill="grey">{{ text }}</text>
        </template>
        <template v-else>
            <text :x="text_layout.x" :y="text_layout.y" fill="grey">{{ text }}</text>
        </template>
        <!-- button image -->
        <image :x="btn_layout.x" :y="btn_layout.y" :height="btn_layout.h" preserveAspectRatio :href="trigger_href" />
    </svg>
</template>

<script>
const IMAGE_FOLDER = '/img/preview';
const LAYOUT_DEFAULT = '좌측';
const LAYOUT_OBJECT = {
    '좌측': { x: "75%", y: "5%", h: '90%' },
    '우측': { x: "25%", y: "5%", h: '90%' },
    '중앙': { x: "5%", y: "5%", h: '90%' },
    '좌우': { x: "40%", y: "5%", h: '90%' },
};
const LAYOUT_TEXT = {
    '좌측': { x: "5%", y: "50%" },
    '우측': { x: "75%", y: "50%" },
    '중앙': { x: "50%", y: "50%" },
};
const LAYOUT_BUTTON = {
    '좌측': { x: "90%", y: "50%", h: '40%' },
    '우측': { x: "10%", y: "50%", h: '40%' },
    '중앙': { x: "90%", y: "50%", h: '40%' },
    '좌우': { x: "55%", y: "50%", h: '40%' },
};
const OBJET_MAP = {
    '일러스트': 'illust',
    '실사': 'picture',
    '모델': 'model',
    '텍스트': 'text',
};
const BACKGROUND_MAP = {
    '단색_밝은색': 'solid_light',
    '단색_어두운색': 'solid_dark',
    '이미지': 'image',
    '면분할': 'split',
    '공백': 'blank',
};
const TRIGGER_MAP = {
    'User Persuasive Text': 'suggest',
    'Emphasize Reward': 'reward',
    'Highlight benefits': 'benefit',
    'Include Seasonlaity': 'season',
    'Create Ungency': 'time',
    'Esatablish credibility': 'credible',
}

export default {
    name: 'preview',
    props: ['data'],
    computed: {
        background: function() {
            let bgtype = this.data['design.background'];
            return `${IMAGE_FOLDER}/background_${BACKGROUND_MAP[bgtype] ? BACKGROUND_MAP[bgtype] : 'blank'}.png`;
        },
        objet_layout: function() {
            let layout = this.data['design.layout'];
            return LAYOUT_OBJECT[layout] || LAYOUT_OBJECT[LAYOUT_DEFAULT];
        },
        objet_href: function() {
            let otype = this.data['design.objet'];
            return `${IMAGE_FOLDER}/objet_${OBJET_MAP[otype]}.png`;
        },
        text_layout: function() {
            let layout = this.data['design.layout'];
            return LAYOUT_TEXT[layout] || LAYOUT_TEXT[LAYOUT_DEFAULT];
        },
        text: function() {
            return this.data['content.adcopy'];
        },
        btn_layout: function() {
            let layout = this.data['design.layout'];
            return LAYOUT_BUTTON[layout] || LAYOUT_BUTTON[LAYOUT_DEFAULT];
        },
        trigger_href: function() {
            let trigger = this.data['content.trigger'];
            return `${IMAGE_FOLDER}/button_${trigger}.png`;
        }


    }
}
</script>