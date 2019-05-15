<template>
	<div id="app">
		<navigation />
		<main class="wrap-container">
			<sidebar :routes="routes" />
			<transition name="fade">
				<router-view class="container-fluid background-light"></router-view>
			</transition>
		</main>
	</div>
</template>

<script>
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import VueRouter from 'vue-router';
import 'moment';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.min.css';

import navigation from './components/navigation';
import sidebar from './components/sidebar';
import dashboard from './components/Dashboard';
import creative from './components/Creative';
import simulation from './components/Simulation';
import glogin from './components/Login';

Vue.use(BootstrapVue);
Vue.use(VueRouter);

const routes = [
	{ path: '/login', component: glogin },
	{ path: '/', name: '업종별 분석', component: dashboard },
	{ path: '/creative', name: '크리에이티브 분석', component: creative },
	{ path: '/simulation', name: '예상효율 확인', component: simulation },
];
const router = new VueRouter({ routes });


export default {
	name: 'app',
	components: {
		navigation,
		sidebar,
	},
	data: () => {
		return {
			routes: routes,
		}
	},
	router: router,
}
</script>

<style>
*,body {
	margin: 0;
  padding: 0;

  background-color: transparent;
  color: var(--font-normal);
  
  font-weight: 300;
  font-family: 'Noto Sans KR', sans-serif;

  --bg-dark: #262626;
  --bg-light: #F2F2F2;
  --bg-select: #DEEBF7;
  --bg-white: #FFFFFF;

  --data-grey: #D9D9D9;
  --data-primary: #20ADE3;
  --data-secondary: #002060;
  --data-dark: #1F4E79;
  --data-light: #9DC3E6;

  --font-normal: #262626;
  --font-dark: #002060;
  --font-light: #595959;
  --font-white: #eeeeee;

  --gnb-height: 76px;
  --sidebar-width: 190px;

  --font-size--2: 8px;
  --font-size--1: 10px;
  --font-size-0: 12px;
  --font-size-1: 14px;
  --font-size-2: 16px;
  --font-size-3: 18px;
  --font-size-3: 20px;
  --font-size-4: 22px;
  --font-size-5: 24px;
  --font-size-6: 26px;
  --font-size-7: 28px;
  --font-size-8: 32px;
  --font-size-9: 40px;


  --padding-0: 14px;
  --padding-1: 25px;
  --padding-2: 35px;
  --padding-3: 45px;
  --padding-4: 65px;
  --padding-5: 80px;
  --padding-6: 100px;

  --section-title-font-size: 40px;
  --section-subtitle-font-size: var(--font-size-2);
}
.query-btn.shadow {
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5) !important;
}

[data-toggle="dropdown"] i.fa-chevron {
	align-self: flex-start;
	color: var(--bg-light);
	margin: 0px;
	padding: 0px;
}


.wrap-container {
	display: flex;
	flex-direction: row;
	min-width: 90vw;
	min-height: calc(100vh - 56px);
	margin-top: var(--gnb-height);
}

.background-light {
	color: var(--font-normal);
	background-color: var(--bg-light);

	font-size: 0.5em;
}

.background-dark {
	color: var(--font-white);
	background-color: var(--bg-dark);
}

.panel-wrapper {
	padding-top: var(--padding-1);
	padding-left: var(--padding-0);
}

.dropdown-menu .dropdown-item {
	font-size: var(--font-size-1);
	min-width: 10vw;
}



.dropdown-menu {
	max-height: 50vh;
	overflow: auto;
}
.dropdown-menu::-webkit-scrollbar {
	width: 4px;
}
.dropdown-menu::-webkit-scrollbar-track {
	background-color: var(--bg-light);
}
.dropdown-menu::-webkit-scrollbar-thumb {
	background-color: var(--data-primary);
}


/* recharts */
text.recharts-text {
	font-size: var(--font-size--1);
	word-wrap: none;
	white-space: nowrap;
	word-break: keep-all;
}


/* color class */
.class-design {
	color: var(--font-normal);
}
.class-message {
	color: var(--font-dark);
}

.footer {
	height: 30px;
	background-color: #f2f2f2;
	font-size: var(--font-size-1);
	line-height: 2.0em;
	color: var(--font-light);
	/* text-align: right; */
}

.footer a {
	color: var(--font-light);
	text-decoration: none;
	text-transform: uppercase;
	/* margin-left: .25em; */
}

@media print {
	body { visibility: hidden; }
	.printable { 
		visibility: visible; 
		position: absolute;
		top: 0px;
		left: 0px;
		width: 100%;
	}
}
</style>
