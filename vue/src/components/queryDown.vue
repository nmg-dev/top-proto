<template>
    <div class="querybar-down">
        <div class="querybar-controls">
            <subcategory 
                title="Design Type"
                class="querybar-controls"
                :options="designTypeOptions"
                @refreshUpdate="$emit('refreshUpdate')">
            </subcategory>
            <subcategory 
                title="Message Type"
                class="querybar-controls"
                :options="messageTypeOptions"
                @refreshUpdate="$emit('refreshUpdate')">
            </subcategory>
        </div>
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
    .querybar-down {
        width: 100%;
        display: block;
        align-items: flex-start;
        justify-content: space-between;
    }
    .querybar-down .categorybar-wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        margin-right: var(--padding-2);
    }
    .querybar-down .categorybar-wrapper .wrapper-title  {
        font-size: var(--font-size-2);
        font-weight: 700;
        padding-bottom: calc(0.25*var(--font-size-0));
        border-bottom: 3px solid var(--data-grey);
    }
    .querybar-down .categorybar-wrapper .categorybar-subwrapper  {
        display: flex;
        flex-direction: row;
        align-items: baseline;
        justify-content: space-between;
        
    }
    .querybar-down .categorybar-subwrapper .control-title {
        font-size: var(--font-size-0);
        font-weight: 600;
        text-transform: capitalize;
        margin: 0px;
    }

    .querybar-down .query-control {
        margin-top: 0px;
        margin-bottom: 0px;
    }

    .querybar-down .query-control .query-btn .label-icon {
        display: none;
        width: 0px;
        height: 0px;
        border: 0px;
        padding: 0px;
    }

    .querybar-down .query-control.categorybtn .query-btn {
        width: 8vw;
        border: 1px solid var(--data-grey);
    }

    .querybar-down .query-control.categorybtn .btn-group>.btn {
        width: 8vw;
        font-size: var(--font-size--1);
        border-radius: 6px;
        margin: 0px;
        padding: 2px;
    }
    .querybar-down .query-btn.shadow {
        box-shadow: none !important;
        border-radius: 4px;
    }

    .querybar-down .query-control.categorybtn .btn-group>.btn .label-text {
        padding: 0px;
    }
    .querybar-down .query-control.categorybtn .btn-group>.btn .label-text .text-muted {
        margin: 0px;
    }
</style>