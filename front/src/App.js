import React from 'react';

import AppLogin from './screens/appLogin.js';
import AppCommon from './screens/appCommon.js';

import AppConfig from './config.js';
import { Card, CardHeader, Icon, CardContent, CardActions, Chip, Avatar, IconButton, Divider, Menu, MenuItem, AppBar, Toolbar, Typography, Grid } from '@material-ui/core';

import AppAdmin from './screens/appAdmin';
import AppManage from './screens/appManage';
import AppData from './screens/appData';
import AppFoot from './screens/components/appFoot.js';
import AppLocale from './screens/components/appLocale.js';
import AppProfile from './screens/components/appProfile.js';

// const modAPI = require('./modules/api');
// const modData = require('./modules/data');
import ModApi from './modules/api';
import ModData from './modules/data';
import moment from 'moment';

const styles = {
	loginPanel: {
		width: '100vw',
		height: '100vh',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
    loginCard: {
		display: 'flex',
		flexDirection: 'column',
		minWidth: '320px',
		minHeight: '300px',
		width: '30vw',
		height: '30vh',
	},

	loginCardHead: {
	},
	loginCardBody: {
	},
	loginCardFoot: {
		display: 'flex',
		justifyContent: 'flex-end'
	},

	viewMenuItem: {
		textTransform: 'upper',
	},
}

const languages = ['en', 'ko'];
const viewIndex = 'index';
const viewInfo = 'view';
const viewAdmin = 'admin';
const viewManage = 'manage';
const views = [viewIndex, viewInfo, viewManage, viewAdmin];

class App extends React.Component {
	constructor(props) {
		super(props);

		this.api = new ModApi(AppConfig.API_HOST);
		this.data = new ModData();
	
		this.state = {
			hasLogin: this.api.hasLogin(),
			view: 'view'
		}
		window.__app = this;
	}
	
	listViews() {
		return views;
	}

	_onLoginServerResponseSuccess(userinfo) {
		this.setState({hasLogin: this.api.hasLogin()});
		this.api.getTags((tags) => {
			this.data.setTags(tags);
		});
		this.api.getCampaigns({
				//TODO: update
				from: moment().add(-1, 'year').toDate(),
				till: moment().toDate()
			}, 
			(cs) => {this.data.setCampaigns(cs); },
			(er) => {console.error(er);}
		);
	}
	_onLoginServerResponseFailure(err) {
		console.log('login error', err);
		this.setState({hasLogin: false});
	}
	onLoginCallback(gauth) {
		// console.log(gauth);
		// 
		let resp = gauth.getAuthResponse();
		let profile = gauth.getBasicProfile();
		this.api.getAuth({
			gid: profile.getId(),
			email: profile.getEmail(),
			token: resp.id_token,
		}, 
			this._onLoginServerResponseSuccess.bind(this),
			this._onLoginServerResponseFailure.bind(this));
	}
	renderLoginScreen() {
		return (
			<div style={styles.loginPanel}>
				<Card style={styles.loginCard}>
					<CardHeader style={styles.loginCardHead} 
						title="TAG OPERATION v0.alpha"
						subheader={<a href="https://www.nextmediagroup.co.kr">by NextMediaGroup</a>}
						avatar={<Icon>lock</Icon>}
					/>
					
					<CardContent style={styles.loginCardBody}>
						<h1>Please Login</h1>
					</CardContent>
					<CardActions style={styles.loginCardFoot}>
						<div className="g-signin2" 
							data-onsuccess="_onGoogleLoginSuccess"
							data-onerror="_onGoogleLoginFailure"
						></div>
					</CardActions>
				</Card>
			</div>
		);
	}
	
	renderAdminScreen() {
		return (<AppAdmin app={this} api={this.api.bind(this)} />);
	}

	renderManageScreen() {
		return (<AppManage app={this} api={this.api.bind(this)} />);
	}

	renderViewScreen() {
		return (<AppData ref={this.refs.viewData} app={this} api={this.api.bind(this)} />);
	}

	renderStage() {
		if(this.state.view=='admin' && this.canAdmin())
			return this.renderAdminScreen();
		else if(this.state.view=='manage' && this.canManage())
			return this.renderManageScreen();
		else
			return this.renderViewScreen();
	}

	render() {
		if(!this.state.hasLogin)
			return this.renderLoginScreen();

		return (
			<div style={styles.appContainer}>
                <AppBar position="sticky" style={styles.appbar}>
                    <Toolbar style={styles.toolbar}>
                        <div style={styles.toolbarItem}>
                            <Typography style={styles.logo}>TAG OPERATION by NMG</Typography>
                        </div>
                        <div style={styles.toolbarItem}>
                            <AppLocale app={this} ref={this.refs.locales} />
							<AppProfile app={this} ref={this.refs.profile} />
                        </div>
                    </Toolbar>
                </AppBar>

                <Grid container>
                    <Grid item xs={12}>
                    </Grid>
                </Grid>
                <AppFoot />
            </div>
		);
	}
}
export default App;
