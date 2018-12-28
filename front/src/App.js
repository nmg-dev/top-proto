import React from 'react';

import AppLogin from './screens/appLogin.js';
import AppCommon from './screens/appCommon.js';

import AppConfig from './config.js';
import { Card, CardHeader, Icon, CardContent, CardActions, Chip, Avatar, IconButton, Divider, Menu, MenuItem } from '@material-ui/core';

import AppAdmin from './screens/appAdmin';
import AppManage from './screens/appManage';
import AppData from './screens/appData';

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

const menuProfile = '_menu_profile';
const menuLocale = '_menu_locale';

class App extends React.Component {
	constructor(props) {
		super(props);
	
		this.state = {
			// authentication
			login: false,
			email: null,
			profile: null,
			token: null,
			can_admin: false,
			can_manage: false,
			
			// locale
			lang: 'en',
			view: 'index',

			// top menu
			openMenu: null,
		}
		window.__app = this;

		this.view = React.createRef();
		this.refs = {
			profileMenu: React.createRef(),
			profileAnchor: React.createRef(),
			localeMenu: React.createRef(),
			localeAnchor: React.createRef(),

			viewData: React.createRef(),
		};
	}

	/* sending api */
	api(endpoint, options) {
		if(!options) options = {credentials: 'include'}
		else options.credentials = 'include';

		return fetch(AppConfig.API_HOST + endpoint, options)
			.catch((err) => { window.alert(err); window.location.reload(); })
			.then((plainResp) => plainResp.json())
	}

	/* authentication */
	hasLogin() { return this.state.login && this.state.token; }
	canAdmin() { return this.state.can_admin && this.hasLogin() }
	canManage() { return this.state.can_manage && this.hasLogin() }
	_onLoginServerResponseSuccess(userinfo) {
		this.setState({
			login: true,
			email: userinfo.email,
			profile: userinfo.profile,
			token: userinfo.token,
			can_admin: userinfo.can_admin,
			can_manage: userinfo.can_manage,
		});
	}
	_onLoginServerResponseFailure(err) {
		this.setState({
			login: false,
			email: null,
			profile: null,
			token: null,
			can_admin: false,
			can_manage: false,
		});
	}
	onLoginCallback(gauth) {
		// 
		let resp = gauth.getAuthResponse();
		let profile = gauth.getBasicProfile();	
		let authOptions = {
			method: 'POST',
			body: JSON.stringify({
				gid: profile.getId(),
				email: profile.getEmail(),
				token: resp.id_token
			})
		};
		// console.log(authOptions);
		this.api('/auth', authOptions)
			.then(this._onLoginServerResponseSuccess.bind(this))
			.catch(this._onLoginServerResponseFailure.bind(this));
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
	/* with logins */
	renderProfileButton() {
		return (<IconButton ref={this.refs.profileAnchor}
			aria-haspopup="true"
			aria-owns={menuProfile}
			onClick={(ev) => this.setState({openMenu: menuProfile})}>
				<Icon>person</Icon>
		</IconButton>);
	}
	renderProfileButtonMenu() {
		return (<Menu ref={this.refs.profileMenu} id={menuProfile}
			open={this.state.openMenu==menuProfile}
			onClose={()=>{this.setState({openMenu: null})}}
			anchorEl={this.refs.profileAnchor}>
			<MenuItem>
				<Chip title={this.state.email}
					avatar={<Avatar 
						alt="profile image" 
						src={this.state.profile?this.state.profile.picture:''} />}
					label={this.state.profile?this.state.profile.name:''} />
			</MenuItem>
			<Divider />
			{views.map((v) => (
			<MenuItem view={v}
				style={styles.viewMenuItem}
				onClick={(ev) => {this.setState({openMenu: null, view: ev.target.getAttribute('view')})}}>
			</MenuItem>))}
		</Menu>);
	}

	/* Locales */
	getLocale() { return this.state.lang; }
	setLocale(ln) { this.setState({lang: ln})}
	lang() {
		// TODO: build with keys
	}
	updateLocale(nextLocale) {
		this.setState({lang: nextLocale});
	}
	renderLanguageButton() {
		return (
			<IconButton ref={this.refs.localeAnchor} 
				aria-owns={menuLocale}
				aria-haspopup="true"
				onClick={(ev) => { this.setState({openMenu: menuLocale})}}>
				<Icon>language</Icon>
			</IconButton>);
	}
	renderLanguageButtonMenu() {
		return (<Menu ref={this.localeMenu} id={menuLocale}
			open={this.state.openMenu=='locale'}
			onClose={()=>{this.setState({openMenu: null})}}
			anchorEl={this.refs.localeAnchor}>
			{languages.map((ln) => 
				<MenuItem button onClick={(ev)=>{this.setState({lang: ev.target.getAttribute('lang')})}} key={ln} lang={ln}>{ln}</MenuItem>
			)}
		</Menu>);
	}

	renderAdminScreen() {
		return (<AppAdmin app={this} api={this.api.bind(this)} />);
	}

	renderManageScreen() {
		return (<AppManage app={this} api={this.api.bind(this)} />);
	}

	renderViewScreen() {
		return (<AppData ref={this.refs.viewData} app={this} api={this.api.bind(this)} mode={viewInfo} />);
	}

	renderIndexScreen() {
		return (<AppData ref={this.refs.viewData} app={this} api={this.api.bind(this)} mode={viewIndex} />);
	}

	render() {
		if(!this.hasLogin)
			return this.renderLoginScreen();

		if(this.state.view=='admin' && this.canAdmin())
			return this.renderAdminScreen();
		else if(this.state.view=='manage' && this.canManage())
			return this.renderManageScreen();
		else if(this.state.view=='view')
			return this.renderViewScreen();
		else
			return this.renderIndexScreen();
	}
}
export default App;
