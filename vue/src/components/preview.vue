<template>
    <svg 
        class="creative-preview" 
        xmlns="http://www.w3.org/2000/svg" 
        xmlnsXlink="http://www.w3.org/1999/xlink"
        v-b-tooltip :title="stringifyData">
        <!-- background image -->
        <image 
            v-if="data['design.background']"
            x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" :href="background" />
        <!-- objet image -->
        <image 
            v-if="data['design.objet']"
            :x="objet_layout.x" :y="objet_layout.y" :height="objet_layout.h" preserveAspectRatio :href="objet_href" />
        <!-- button image -->
        <image 
            v-if="data['design.button']"
            :x="btn_layout.x" :y="btn_layout.y" :height="btn_layout.h" preserveAspectRatio :href="trigger_href" />
    </svg>
</template>

<script>
import langs from '../langs.js';

const IMAGE_FOLDER = '/img/preview';
const LAYOUT_DEFAULT = '좌측';
const LAYOUT_OBJET = {
    '좌측': { x: "65%", y: "5%", h: '75%' },
    '우측': { x: "35%", y: "5%", h: '75%' },
    '중앙': { x: "5%", y: "5%", h: '75%' },
    '좌우': { x: "40%", y: "5%", h: '75%' },
};
const LAYOUT_BUTTON = {
    '좌측': { x: "45%", y: "50%", h: '25%' },
    '우측': { x: "5%", y: "50%", h: '25%' },
    '중앙': { x: "75%", y: "70%", h: '25%' },
    '좌우': { x: "75%", y: "50%", h: '25%' },
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
const BUTTON_MAP = {
    '혜택형': 'reward',
    '유도형': 'suggest',
    '타임형': 'time',
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
            return LAYOUT_OBJET[layout] || LAYOUT_OBJET[LAYOUT_DEFAULT];
        },
        objet_href: function() {
            let otype = this.data['design.objet'];
            return `${IMAGE_FOLDER}/objet_${OBJET_MAP[otype]}.png`;
        },
        // text_layout: function() {
        //     let layout = this.data['design.layout'];
        //     return LAYOUT_TEXT[layout] || LAYOUT_TEXT[LAYOUT_DEFAULT];
        // },
        // text: function() {
        //     return this.data['content.trigger'];
        // },
        btn_layout: function() {
            let layout = this.data['design.layout'];
            return LAYOUT_BUTTON[layout] || LAYOUT_BUTTON[LAYOUT_DEFAULT];
        },
        trigger_href: function() {
            let trigger = BUTTON_MAP[this.data['design.button']];
            return `${IMAGE_FOLDER}/button_${trigger}.png`;
        },
        stringifyData: function() {
            return Object.keys(this.data).reduce((buf,mk) => {
                if(0<buf.length)
                    buf += '\n';
                return buf + `${langs.ko[mk] ? langs.ko[mk] : mk}: ${this.data[mk]}`;
            }, '');
        }


    }
}
</script>