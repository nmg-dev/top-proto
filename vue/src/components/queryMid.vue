<template>
    <div class="querybar-mid">
        <categorybtn title="업종" cls="category" :icon="true"  @refreshUpdate="refreshUpdate" />
        <categorybtn title="채널" cls="channel" :icon="true" @refreshUpdate="refreshUpdate" />
        <categorybtn title="미디어" cls="media" :icon="true" @refreshUpdate="refreshUpdate" />
        <categorybtn title="광고목적" cls="goal" :icon="true" @refreshUpdate="refreshUpdate" />
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