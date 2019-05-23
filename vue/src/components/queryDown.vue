<template>
    <div class="querybar-down d-flex">
        <subcategory 
            title="Design Type"
            :options="designTypeOptions">
        </subcategory>
        <subcategory 
            title="Message Type"
            :options="messageTypeOptions">
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
    computed: {
        designTypeOptions : function() {
            return utils.getPresetDesignClasses().map((cls) => {
                return { items: utils.getTagsWithinClass(cls), title: langs.ko[cls] }
            })
        },
        messageTypeOptions : function() {
            return utils.getPresetMessageClasses().map((cls) => {
                return { items: utils.getTagsWithinClass(cls), title: langs.ko[cls] }
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