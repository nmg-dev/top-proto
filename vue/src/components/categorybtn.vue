<template>
    <b-button-group class="query-control">
        <b-dropdown class="query-btn btn" no-caret>
            <div slot="button-content" class="label-text text-muted">
                <img v-if="iconUrl!=null" :src="iconUrl" :alt="title" />
                {{title}}
                <i class="fas fa-chevron-down" />
            </div>
            <b-dropdown-item value="" @click="resetSelections">{{labelNone}}</b-dropdown-item>
            <template v-for="item in items">
                <b-dropdown-item :data-tagid="item.value" :value="item.value" :key="item.value" @click="toggleSelection">{{item.label}}</b-dropdown-item>
            </template>
        </b-dropdown>
    </b-button-group>
</template>

<script>
import utils from '../utils.js';

export default {
    name: 'categorybtn',
    props: {
        title: { type: String },
        cls: { type: String },
        icon: {},
        labelNone: { type: String, default: 'ALL' },
    },
    methods: {
        resetSelections: function() {
            if(utils.resetFilter(this.cls))
                this.$emit('refreshUpdate');
        },
        toggleSelection: function(ev) {
            let el = ev.currentTarget || ev.target;
            let tid = el.dataset.tagid;

            if(this.values && 0<=this.values.indexOf(tid)) {
                if(utils.delFilter(tid))
                    this.$emit('refreshUpdate');
            } else {
                if(utils.addFilter(tid))
                    this.$emit('refreshUpdate');
            }
        },
    },
    computed: {
        items: function() {
            return utils.getTagsWithinClass(this.cls)
                .map((tag) => { return { value: tag.id, label: tag.name }; });
        },
        iconUrl: function() {
            if(this.icon != false)
                return typeof(this.icon)!=='boolean' ? this.icon : `/img/icon-${this.cls}.png`;
            else
                return null;
        },
        values: function() {
            return utils.getFilter() ? utils.getFilter()[this.cls] : [];
        },
    },
    data: function() {
        return {
        };
    },
}
</script>

<style>
</style>