<template>
    <div class="querybar-mid">
        <categorybtn class="querybar-controls" 
            v-for="cls in classes"
            :title="lang(cls)" 
            :cls="cls" 
            :icon="true"
            :autofilter="cls == 'admedia'"
            @refreshUpdate="refreshUpdate" />
    </div>
</template>

<script>
import utils from '../utils.js';
import langs from '../langs.js';

import categoryBtn from './categorybtn';


export default {
    name: 'querymid',
    components: {
        'categorybtn': categoryBtn,
    },
    methods: {
        lang: function(key) {
            return langs.ko[key] || key;
        },
        refreshUpdate: function() {
            this.$emit('refreshUpdate');
        }
    },
    data: () => {
        return {
            classes: utils.querymid_classes,
        }
    }
}
</script>

<style>
    .querybar-mid {
        display: flex;
        flex-direction: row;
    }
    .querybar-mid .query-control {
        display: flex;
        justify-content: space-between;
        width: 13.5vw;
        padding-top: calc(0.5*var(--font-size--1));
        padding-bottom: calc(0.5*var(--font-size--1));
    }
    .querybar .querybar-mid .query-control .query-btn {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 13.5vw;
        padding-top: calc(0.5*var(--font-size--1));
        padding-bottom: calc(0.5*var(--font-size--1));
    }
</style>