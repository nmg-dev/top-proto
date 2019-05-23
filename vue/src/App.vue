<template>
	<div id="app">
		<navigation></navigation>
		<main class="wrap-container">
			<sidebar></sidebar>
			<transition name="fade">
				<div class="container-fluid panel-wrapper">
					<div class="row m-0 p-0">
						<div class="col m-0 p-0">
							<div class="querybar">
								<querytop :controls="showTopControls"></querytop>
								<querymid v-if="showMidControls"></querymid>
								<querydown v-if="showDownControls"></querydown>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col col-12">
							<b-card>
								<router-view 
									class="container-fluid background-light"
									style="min-height: 50vh;"
									language="ko"
								>
								</router-view>
							</b-card>
						</div>
					</div>
				</div>
			</transition>
		</main>
	</div>
</template>

<script>
import navigation from './components/navigation';
import sidebar from './components/sidebar';

import querytop from './components/queryTop';
import querymid from './components/queryMid';
import querydown from './components/queryDown';

import utils from './utils.js';
import Route from './routes.js';


export default {
	name: 'app',
	components: {
		navigation,
		sidebar,

		querytop,
		querymid,
		querydown,
	},

	data: function() {
		return {
			showTopControls: false,
			showMidControls: false,
			showDownControls: false,
		}
	},
	methods: {
	},
	updated() {
		this.showTopControls = Route.showTopControls(this.$route.path);
		this.showMidControls = Route.showMidControls(this.$route.path);
		this.showDownControls = Route.showDownControls(this.$route.path);
	},
	created: function() {
		if(!utils.getToken())
			this.$router.push('/login');
		else if(!this.$routes)
			this.$router.push(Route.index());

		//
		utils.retrieveTags();
		utils.retrieveCampaigns();
	},

	mounted: function() {			
	}
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

	@import 'https://use.fontawesome.com/releases/v5.8.2/css/all.css';
</style>
