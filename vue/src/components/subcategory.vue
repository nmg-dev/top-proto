<template>
    <div class="categorybar-wrapper">
        <h3 class="wrapper-title">{{ title }}</h3>
        <div class="categorybar-subwrapper">
            <div class="categorybar-control-wrapper" v-for="opt in options">
                <h5 class="control-title">{{ opt.title }}</h5>
                <div class="button-group category-control">
                    <categorybtn 
                        @refreshUpdate="$emit('refreshUpdate')"
                        :cls="opt.cls"
                        :icon="false"
                        :items="opt.items.map((tag)=>{ return {value: tag.id, label: tag.name}})" 
                        :title="opt.title" 
                        labelNone="ALL" >
                    </categorybtn>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import categorybtn from './categorybtn';
import langs from '../langs.js';

export default {
    name: 'subcategory',
    props: [
        'title',
        'options',
        'onchange',
    ],
    components: {
        categorybtn,
    },
    data: function() {
        return {
        };
    },
    methods: {
        lang: function(key) {
            return langs.ko[key];
        }
    }
}
</script>