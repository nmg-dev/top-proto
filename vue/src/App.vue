<template>
	<div id="app" :key="latestUpdate">
		<navigation></navigation>
		<main class="wrap-container">
			<sidebar></sidebar>
			
			<div class="container-fluid panel-wrapper m-0 p-4">
				<div class="row m-0 p-0">
					<div class="col m-0 p-0">
						<div class="querybar">
							<querytop :controls="showTopControls" @refreshUpdate="refreshUpdate"></querytop>
							<querymid v-if="showMidControls" @refreshUpdate="refreshUpdate"></querymid>
							<querydown v-if="showDownControls" @refreshUpdate="refreshUpdate"></querydown>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col col-12">
						<b-card class="panel">
							<transition name="slide-fade">
								<router-view
									class="container-fluid"
									style="min-height: 50vh;"
									language="ko"
								>
								</router-view>
							</transition>
						</b-card>
					</div>
				</div>
			</div>
			
		</main>
	</div>
</template>

<script>
const GTM_ID = 'GTM-NKNJZMQ';
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
			latestUpdate: Date.now(),
		}
	},
	methods: {
		refreshUpdate: function() {
			this.latestUpdate = Date.now();
		}
	},
	beforeUpdate() {
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

		utils.gtm(GTM_ID);
	},

	mounted: function() {			
	}
}
</script>

<style>
	@import url('https://fonts.googleapis.com/css?family=Noto+Sans+KR:100,300,400,500,700,900&display=swap&subset=korean');
	@import 'https://use.fontawesome.com/releases/v5.8.2/css/all.css';

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
	#app {
		background-color: var(--bg-light);
	}

	
	.query-bar .querybar-controls {
		display: flex;
	}
	.querybar .querybar-controls:first-child {
		margin-left: 0px;
	}
	.querybar .querybar-controls:last-child {
		margin-right: 0px;
	}

	.query-control .query-btn {
        background-color: #fff;
        display: flex;
        min-width: 5vw;
        max-width: 280px;
        align-items: center;
        border-radius: 6px;
    }

	.query-control ul.dropdown-menu a.dropdown-item[checked] {
		color: var(--data-primary);
		background-color: var(--bg-select);
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

	.input-group {
		width: inherit;
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

	.card.panel {
		border-top: none;
		border-left: none;
		border-radius: 2px;
		box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.5);
		width: 100%;
		min-width: 720px;
		padding-top: 4vh;
		padding-bottom: 6vh;
		padding-left: 10vw;
		padding-right: 10vw;
		text-align: center;
		color: var(--font-normal);
	}

	.card.panel .row.panel-header {
		text-align: center;
		border-bottom: 1px solid #262626;
		margin: 0px;
	}

	.card.panel .panel-title {
		margin-top: .25rem;
		margin-bottom: .25rem;
		font-size: var(--font-size-5);
		font-weight: 600;
	}

	.card.panel .row.dashboard-card-design, .card.panel .row.dashboard-card-message {
		padding-left: 5vw;
		padding-right: 5vw;
		word-break: keep-all;
		white-space: nowrap;
		overflow: visible;
	}

	.card.panel .section-title {
		text-align: center;
		font-weight: 700;
		font-size: var(--font-size-6);
		margin-top: var(--padding-1);
		padding: 0px;
	}

	.card.panel .row.dashboard-card-design, .card.panel .row.dashboard-card-message {
		padding-left: 5vw;
		padding-right: 5vw;
		word-break: keep-all;
		white-space: nowrap;
		overflow: visible;
	}

	.card.panel .row.dashboard-card-design, .card.panel .row.dashboard-card-message {
		padding-left: 5vw;
		padding-right: 5vw;
		word-break: keep-all;
		white-space: nowrap;
		overflow: visible;
	}

	.card.panel a {
		cursor: pointer;
	}

	.card.panel .row.dashboard-card-design,
	.card.panel .row.dashboard-card-message
	{
		padding-left: 5vw;
		padding-right: 5vw;
		word-break: keep-all;
		white-space: nowrap;
		overflow: visible;
	}
	.card.panel .row.dashboard-card-chart {
		margin-top: var(--padding-5);
		padding: 0px;
		/* border: 1px solid #979797;
		background-color: #d8d8d8; */
	}
	.card.panel .row.dashboard-card-message {
		margin-bottom: var(--padding-1);
	}
	.card.panel .row.dashboard-card-chart
	{
		margin-bottom: var(--padding-5);
	}

	.card.panel .row.dashboard-card-table .section-title {
		padding: 0px;
		line-height: 2.0em;
		border-bottom: 1px solid #595959;
	}

	.card.panel .panel-details h3 {
		font-size: var(--font-size-8);
	}
	.card.panel .panel-details h5 {
		font-weight: 700;
		font-size: var(--font-size-5);
	}

	.card.panel .panel-details table.table {
		font-size: var(--font-size-1);
	}

	.card.panel .panel-details thead {
		background-color: var(--bg-light);
		border-top: 2px solid var(--data-grey);
		text-transform: capitalize;
	}
	.card.panel .panel-details tr {
		border-bottom: 1px solid var(--data-grey);
	}
	.card.panel .panel-details th {
		padding: 0.24rem;
		min-width: 5vw;
		font-weight: 700;

		text-align: center;
		vertical-align: middle;
	}
	.card.panel .panel-details tbody td {
		font-weight: 400;
		text-align: right;
	}
	.card.panel .panel-details tbody td.class-design {
		background-color: var(--bg-select);
	}
	.card.panel .panel-details tbody td.cell-value {
		text-align: center;
	}

	.class-design {
		color: var(--font-normal);
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
