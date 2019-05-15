<template>
    <b-navbar class="gnb background-dark" fixed="top">
        <b-navbar-brand>
            <img alt="main logo" src="../assets/logo.png" />
        </b-navbar-brand>

        <b-nav class="ml-auto">
            <b-nav-item-dropdown dropleft no-caret>
                <i class="fa fa-globe" slot="button-content" />
            </b-nav-item-dropdown>
            <b-nav-item-dropdown dropleft no-caret>
                <i class="fa fa-user" slot="button-content" />
            </b-nav-item-dropdown>
        </b-nav>
    </b-navbar>
</template>

<script>
export default {
    name: 'navigation',
    props: [],
}
</script>

<style>
.gnb.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--gnb-height);
}
.gnb.navbar .navbar-brand img {
  width: calc(var(--sidebar-width) - 2*var(--padding-0));
}
.gnb.navbar .navbar-nav {
  display: flex;
  flex-direction: row;
  font-size: var(--font-size-4);
}
.gnb.navbar .navbar-nav li {
  text-indent: var(--padding-0);
}
.gnb.navbar .navbar-nav li i {
  color: var(--font-white);
}
.gnb.navbar .navbar-nav .dropdown-menu {
  position: absolute;
}
.gnb.navbar .navbar-nav .dropdown-menu img {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  object-fit: cover;
}
</style>