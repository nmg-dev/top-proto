<template>
    <div class="querybar-top">
        <div class="querybar-title d-flex justify-content-start align-items-center">
            <h1>Tag Operation</h1>
            <sup>Beta</sup>
        </div>
        <div class="querybar-controls" v-if="controls">
            <!-- dropdown metric -->
            <b-button-group class="query-control top-control" no-caret>
                <b-dropdown>
                    <template slot="button-content">
                        <div class="label-icon m-0 p-0">
                            <img src="../assets/icon-metric.png" alt="ruler" />
                        </div>
                    </template>

                    <b-dropdown-item>CPC</b-dropdown-item>
                </b-dropdown>
            </b-button-group>
            
            <!-- period control -->
            <b-button-group class="query-control top-control" no-caret>
                <b-dropdown></b-dropdown>
            </b-button-group>
        </div>
    </div>
</template>

<script>
export default {
    name: 'querytop',
    props: ['controls'],
    data: () => {
        return {
        
        };
    }
}
</script>

<style>
</style>