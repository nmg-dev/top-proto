<template>
    <div class="categorybar-wrapper">
        <h3 class="wrapper-title">{{ title }}</h3>
        <div class="categorybar-subwrapper">
            <div class="categorybar-control-wrapper" v-for="opt in options">
                <h5 class="control-title">{{ opt.cls }}</h5>
                <div class="button-group category-control">
                    <categorybtn 
                        :items="opt.items" 
                        :title="opt.title" 
                        labelNone="ALL" 
                        @change="opt.onchange">
                    </categorybtn>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import categorybtn from './categorybtn';

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
        return {};
    },
}
</script>