<template>
    <div class="sidebar background-dark m-0 p-0">
        <div class="sidebar-inner" v-show="show">
            <ul>
                <li class="sidebar-item logo m-0 p-0 d-flex justify-content-center"
                    title="COS;Creative Optimization System by NMG">
                    <span style="color: var(--font-white); font-size: 60px; font-weight: 900;">COS</span> 
                    <sup style="color: var(--data-primary); font-size: 18px; font-weight: 300;">Beta</sup>
                </li>
                <template  v-for="rt in $router.options.routes">
                    <li v-if="rt.name" :key="rt.path" class="sidebar-item">
                        <router-link :to="rt.path">{{rt.name}}</router-link>
                    </li>
                </template>
            </ul>
        </div>
        <div class="sidebar-holder m-0 p-1" @click="show=!show">
            <i class="fas fa-chevron-left" v-if="show" />
            <i class="fas fa-chevron-right" v-else />
        </div>
    </div>
</template>

<script>
export default {
    name: 'sidebar',
    data: function(){
        return {
            show: window.innerWidth > 1200,
        }
    }
}
</script>

<style>

/* sidebar */
.sidebar {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    color: var(--font-white);
    font-size: var(--font-size-3);
    font-weight: 500;
}
.sidebar .sidebar-inner {
    width: calc(var(--sidebar-width) - var(--padding-0));
    overflow: hidden;
}
.sidebar .sidebar-inner>ul {
    width: calc(var(--sidebar-width) - var(--padding-0));
    padding-left: var(--padding-0);
    position: fixed;
}
.sidebar .sidebar-item * {
    margin-top: var(--padding-3);
    display: block;
    color: var(--font-light);
    cursor: pointer;
    font-size: var(--font-size-3);
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.1rem;
    font-weight: bold;
}
.sidebar img.logo {
    display: flex;
    justify-content: center;
    margin: 0px;
    padding: 0px;
    width: var(--sidebar-width);
}
.sidebar .sidebar-item .router-link-active {
    color: var(--font-white);
    font-weight: border;
    font-size: calc(var(--font-size-3) + 1px);
    border-bottom: 3px solid #fff;
}
.sidebar .sidebar-item:nth-child(1) {
    margin-bottom: 10vh;
}
.sidebar .sidebar-holder {
    width: 20px;
    height: 100%;
    justify-content: center;
    align-self: center;
    font-size: var(--font-size-1);
    color: var(--font-white);
}
.sidebar .sidebar-holder i {
    color: var(--font-white);
    position: fixed;
    top: 50%;
}
</style>