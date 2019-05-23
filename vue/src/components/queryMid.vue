<template>
    <div class="querybar-mid">
        <categorybtn title="업종" cls="category" :icon="true"  />
        <categorybtn title="채널" cls="channel" :icon="true" />
        <categorybtn title="미디어" cls="media" :icon="true" />
        <categorybtn title="광고목적" cls="goal" :icon="true" />
    </div>
</template>

<script>
import categoryBtn from './categorybtn';


export default {
    name: 'querymid',
    components: {
        'categorybtn': categoryBtn,
    },
    data: () => {
        return {}
    }
}
</script>