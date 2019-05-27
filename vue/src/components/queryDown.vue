<template>
    <div class="querybar-down d-flex">
        <subcategory 
            title="Design Type"
            :options="designTypeOptions"
            @refreshUpdate="$emit('refreshUpdate')">
        </subcategory>
        <subcategory 
            title="Message Type"
            :options="messageTypeOptions"
            @refreshUpdate="$emit('refreshUpdate')">
        </subcategory>
    </div>
</template>

<script>
import subcategory from './subcategory';
import utils from '../utils.js';
import langs from '../langs.js';

export default {
    name: 'querydown',
    components: {
        subcategory,
    },
    methods: {
    },
    computed: {
        designTypeOptions : function() {
            return utils.getPresetDesignClasses().map((cls) => {
                return { cls, items: utils.getTagsWithinClass(cls), title: langs.ko[cls] }
            })
        },
        messageTypeOptions : function() {
            return utils.getPresetMessageClasses().map((cls) => {
                return { cls, items: utils.getTagsWithinClass(cls), title: langs.ko[cls] }
            });
        },
    },
    data: function() {
        return {
        };
    }
}
</script>

<style>
</style>