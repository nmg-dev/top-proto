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
                <b-dropdown-item :value="item.value" :key="item.value" @click="addSelection">{{item.label}}</b-dropdown-item>
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
            let filter = utils.getFilter();
            if(filter) 
                delete filter[this.cls];
            if(filter && 0<Object.keys(filter))
                utils.setFilter(filter);
            else
                utils.setFilter(null);

            //
            this.$emit('refreshUpdate');
        },
        addSelection: function(ev) {
            let el = ev.currentTarget || ev.target;
            let tid = el.key;
            let filter = utils.getFilter() || {};
            if(!filter[this.cls])
                filter[this.cls] = [tid];
            else if(filter[this.cls].indexOf(tid)<0)
                filter[this.cls].push(tid);
            else
                return;

            //
            this.$emit('refreshUpdate');
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
    },
    data: function() {
        return {
            values: [],
        };
    },
}
</script>

<style>
</style>