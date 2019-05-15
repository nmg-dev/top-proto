<template>
    <div class="sidebar background-dark m-0 p-0">
        <div class="sidebar-inner" v-show="show">
            <ul>
                <li class="sidebar-item logo m-0 p-0">
                    <img class="logo" src="../assets/logo_md.png" />
                </li>
                <template  v-for="rt in routes">
                    <li v-if="rt.name" :key="rt.path" class="sidebar-item">
                        <router-link :to="rt.path">{{rt.name}}</router-link>
                    </li>
                </template>
            </ul>
        </div>
        <div class="sidebar-holder m-0 p-1" v-on:click="show=!show">
            <i class="fas fa-chevron-left" v-if="show" />
            <i class="fas fa-chevron-right" v-if="!show" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'sidebar',
    props: ['routes'],
    data: () => {
        return {
            show: true,
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
    margin: 0px;
    padding: 0px;
    width: var(--sidebar-width);
}
.sidebar .sidebar-item .router-link-exact-active {
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