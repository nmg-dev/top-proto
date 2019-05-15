<template>
    <div class="container-fluid panel-wrapper m-0 p-4">
        <div class="row m-0 p-0">
            <div class="col m-0 p-0">
                <div class="querybar">
                    <querytop :controls="true"></querytop>
                    <querymid></querymid>
                    <querydown></querydown>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col col-12">
                <b-card>
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
                </b-card>
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