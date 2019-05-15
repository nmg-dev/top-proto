<template>
    <div class="querybar-mid">
        <categorybtn title="업종" />
        <categorybtn title="장치" />
        <categorybtn title="미디어" />
        <categorybtn title="광고유형" />
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