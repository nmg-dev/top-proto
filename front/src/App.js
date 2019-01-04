import React from 'react';

import AppConfig from './config.js';
import { Card, CardHeader, Icon, CardContent, CardActions, Chip, Avatar, IconButton, Divider, Menu, MenuItem, AppBar, Toolbar, Typography, Grid, Paper } from '@material-ui/core';

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
import AppTools from './screens/components/appTools.js';
import AppView from './screens/appView.js';
import AppIndex from './screens/appIndex.js';

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

		let _refs = {toolbar: React.createRef()};
		views.forEach((v) => _refs[v] = React.createRef());
	
		this.state = {
			hasLogin: this.api.hasLogin(),
			view: viewIndex,
			lang: 'ko',
		}
		this._refs = _refs;

		window.__app = this;

	}

	updateLocale(nextLocale) {
		console.log('set locale to', nextLocale);
		this.setState({lang: nextLocale});
	}

	updateScreen(nextScreen) {
		console.log('move view to', nextScreen);
		this.setState({view: nextScreen});
	}
	
	listViews() {
		
		return views;
	}

	_onLoginServerResponseSuccess(resp) {
		this.setState({hasLogin: this.api.hasLogin()});
		this.api.getTags((tags) => {
			this.data.setTags(tags);
		});
	}
	_onLoginServerResponseFailure(err) {
		this.setState({hasLogin: false});
	}
	onLoginCallback(gauth) {
		// console.log(gauth);
		// 
		let resp = gauth.getAuthResponse();
		let profile = gauth.getBasicProfile();
		let gdata = {
			gid: profile.getId(),
			email: profile.getEmail(),
			token: resp.id_token,
		};
		this.api.getAuth(gdata, 
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


	renderStage() {
		if(this.state.view==viewAdmin && this.canAdmin())
			return (<AppAdmin ref={this._refs.viewAdmin} app={this} api={this.api} />);
		else if(this.state.view==viewManage && this.canManage())
			return (<AppManage ref={this._refs.viewManage} app={this} api={this.api} />);
		else if(this.state.view==viewInfo)
			return (<AppView ref={this._refs.viewInfo} 
				app={this} 
				api={this.api} 
				data={this.data}
				tools={this._refs.toolbar} />);
		else
			return (<AppIndex 
				ref={this._refs.viewIndex} 
				app={this} 
				api={this.api} 
				data={this.data} 
				tools={this._refs.toolbar} />)
	}

	isDataView() {
		return 0<['', viewIndex, viewInfo].indexOf(this.state.view);
	}

	onFilterChange(filter) {
		// TODO: state changed
		console.log(filter);
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
                            <AppLocale app={this} ref={this.refs.locales} lang={this.state.lang} />
							<AppProfile app={this} ref={this.refs.profile} 
								profile={this.api.userProfile()} 
								update={this.updateScreen.bind(this)} />
                        </div>
                    </Toolbar>
                </AppBar>

                <Grid container>
                    <Grid item xs={12}>
						{this.isDataView() ? 
							<AppTools ref={this._refs.toolbar}
								app={this} 
								api={this.api} 
								data={this.data} 
								views={views}
								onChange={this.onFilterChange.bind(this)}
								 /> :
							<h1>{this.state.view}</h1>}
                    </Grid>
					<Grid item xs={12}>
						{this.renderStage()}
					</Grid>
                </Grid>
                <AppFoot />
            </div>
		);
	}
}
export default App;
