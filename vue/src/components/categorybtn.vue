<template>
    <b-button-group class="query-control">
        <b-dropdown class="query-btn btn" no-caret>
            <div slot="button-content" class="label-text text-muted">
                {{title}}
                <i class="fas fa-chevron-down" />
            </div>
            <b-dropdown-item value="">{{labelNone}}</b-dropdown-item>
            <template v-for="item in items">
                <b-dropdown-item :value="item.value" :key="item.value">{{item.label}}</b-dropdown-item>
            </template>
        </b-dropdown>
    </b-button-group>
</template>

<script>
export default {
    name: 'categorybtn',
    props: ['controlCls', 'labelCls', 'title', 'icon', 'items', 'labelNone'],
}
</script>

<style>
</style>