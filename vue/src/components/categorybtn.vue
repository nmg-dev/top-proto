<template>
    <b-button-group class="button-group query-control categorybtn">
        <b-dropdown variant="default" class="query-btn btn shadow m-0 p-0" no-caret :key="displays" :title="displays">
            <template slot="button-content">
                <div class="label-icon">
                    <img class="query-dropdown" v-if="iconUrl!=null" :src="iconUrl" />
                </div>
                <div class="label-text">
                    <b>{{title}}</b>
                    <div class="text-muted">{{ displays }}</div>
                </div>
                <i class="fas fa-chevron-down align-self-start" />
            </template>
            <b-dropdown-item value="" @click="resetSelections">{{labelNone}}</b-dropdown-item>
            <b-dropdown-divider />
            <template v-for="item in items">
                <b-dropdown-item 
                    :checked="values && 0<=values.indexOf(item.value)"
                    :data-tagid="item.value" 
                    :value="item.value" 
                    :key="item.value" 
                    @click="toggleSelection">{{item.label}}</b-dropdown-item>
            </template>
        </b-dropdown>
    </b-button-group>
</template>

<script>
import utils from '../utils.js';
import langs from '../langs.js';

export default {
    name: 'categorybtn',
    props: {
        title: { type: String },
        cls: { type: String },
        icon: {},
        labelNone: { type: String, default: langs.ko.all },
        autoFilter: { type: Boolean, default: true },
    },
    methods: {
        hasCampaigns: function(tag) {
            return utils.hasCampaigns(tag);
        },
        resetSelections: function() {
            if(utils.resetFilter(this.cls))
                this.refreshUpdate();
        },
        toggleSelection: function(ev) {
            let el = ev.currentTarget || ev.target;
            let tid = parseInt(el.dataset.tagid);

            if(this.values && 0<=this.values.indexOf(tid)) {
                if(utils.delFilter(tid))
                    this.refreshUpdate();
            } else {
                if(utils.addFilter(tid))
                    this.refreshUpdate();
            }
        },
        lang: function(key) {
            return langs.ko[key] || key;
        },
        refreshUpdate: function() {
            this.$forceUpdate();
            this.$emit('refreshUpdate');
        }
    },
    computed: {
        items: function() {
            let _tags = this.autofilter ? utils.filteredTags(this.cls) : utils.getTagsWithinClass(this.cls);
            return _tags.map((tag) => { return { tag, value: tag.id, label: tag.name }; });                    
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
        displays: function() {
            if(this.values && 0<this.values.length) {
                let tags = utils.retrieveTags();
                return this.values
                    .map((tid) => tags[tid].name)
                    .join(',');
            } else {
                return `${this.lang(this.cls)} 선택`;
            }
        }
    },
    data: function() {
        return {
        };
    },
}
</script>

<style>
    .query-control.categorybtn  .btn-group>.btn {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 13.5vw;
        padding-top: calc(0.5*var(--font-size--1));
        padding-bottom: calc(0.5*var(--font-size--1));
        overflow: hidden;
    }

    .query-control.categorybtn  .btn-group>.btn .label-icon {
        vertical-align: middle;
        border-style: none;
        width: 26px;
        height: 26px;
        overflow: visible;
    }
</style>