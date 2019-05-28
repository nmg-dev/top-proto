<template>
    <div class="querybar-mid">
        <categorybtn class="querybar-controls" title="업종" cls="category" :icon="true"  @refreshUpdate="refreshUpdate" />
        <categorybtn class="querybar-controls" title="채널" cls="channel" :icon="true" @refreshUpdate="refreshUpdate" />
        <categorybtn class="querybar-controls" title="미디어" cls="media" :icon="true" @refreshUpdate="refreshUpdate" />
        <categorybtn class="querybar-controls" title="광고목적" cls="goal" :icon="true" @refreshUpdate="refreshUpdate" />
    </div>
</template>

<script>
import categoryBtn from './categorybtn';


export default {
    name: 'querymid',
    components: {
        'categorybtn': categoryBtn,
    },
    methods: {
        refreshUpdate: function() {
            this.$emit('refreshUpdate');
        }
    },
    data: () => {
        return {}
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