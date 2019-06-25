<template>
    <b-navbar class="gnb background-dark" fixed="top">
        <b-navbar-brand title="NEXT MEDIA GROUP - media innovation">
            <img alt="main logo" src="../assets/logo.png" />
        </b-navbar-brand>

        <b-nav class="ml-auto">
          
          <b-nav-item v-if="user">
            <b-badge variant="light" pill class="profile-badge">
              <span>{{ user.profile.name }}</span>
              <img :src="user.profile.picture" style="width: 36px; height: 36px; border-radius: 50%; padding: 0px; margin: 0px;" />
            </b-badge>
          </b-nav-item>

          <b-nav-item>
            <b-button v-b-modal.guide-modal
              b-tooltip title="도움말은 클릭!"
              variant="outline-primary" 
              style="width: 38px; height: 38px; border-radius: 50%;">
              <i class="fas fa-question" style="color: var(--font-white);" />
            </b-button>
          </b-nav-item>
        </b-nav>
        <div class="guide">
          <b-modal id="guide-modal" title="가이드" size="xl" ok-only="true">
            <template v-for="ginum in ['01','02','03','04']">
              <img :key="`guide-modal-image-${ginum}`" 
                :src="`/img/guide/guide_${ginum}.png`" />
            </template>
          </b-modal>
        </div>
    </b-navbar>

    
</template>

<script>
import utils from '../utils.js';

export default {
    name: 'navigation',
    props: [],
    data: function() {
      return {
        user: utils.getUser(),
      }
    }
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

.gnb.navbar .profile-badge {
  padding: 0px;
}

.gnb.navbar .profile-badge img {
  width: 36px;
  height: 36px;
  margin: 0px;
  padding: 0px;
  border-radius: 50%;
}

.gnb.navbar .profile-badge span {
  padding-left: 28px;
  padding-right: 12px;
  font-weight: 600;
  color: var(--font-light);
  vertical-align: middle;
}

#guide-modal .modal-body img {
  padding: 0px;
  margin: 0px;
  width: 100%;
}
</style>