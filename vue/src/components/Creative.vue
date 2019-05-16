<template>
    <div class="section panel-details">
        <div class="row section-title">
            <div class="col">
                <h3>Element Analysis</h3>
                <h5>소재 요소 상세 분석</h5>
            </div>
            <div class="row creative-previews">

            </div>
        </div>
    </div>
</template>

<script>
import querytop from './queryTop';
import querymid from './queryMid';
import querydown from './queryDown';

export default {
    name: 'creative',
    components: {
        querytop, 
        querymid, 
        querydown,
    },

}
</script>