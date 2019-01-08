import React from 'react';

import AppConfig from './config.js';
import { Card, CardHeader, Icon, CardContent, CardActions, AppBar, Toolbar, Grid, Paper } from '@material-ui/core';

import ModApi from './modules/api';
import ModData from './modules/data';
import ModLang from './modules/lang';

import AppTools from './screens/components/appTools.js';
import AppLocale from './screens/components/appLocale.js';
import AppProfile from './screens/components/appProfile.js';

import AppAdmin from './screens/appAdmin';
import AppManage from './screens/appManage';
import AppView from './screens/appView.js';
import AppIndex from './screens/appIndex.js';

const styles = {
	appbar: {
		display: 'block',
	},
	toolbar: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		color: '#fff',
	},
	logo: {
		color: '#fff',

	},
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

	footer: {

    },
    footerSection: {
        
    },
    footerCard: {
        height: '20vh'
    },
}

const viewIndex = 'index';
const viewInfo = 'view';
const viewAdmin = 'admin';
const viewManage = 'manage';
const views = [viewIndex, viewInfo];

class App extends React.Component {
	constructor(props) {
		super(props);

		this.api = new ModApi(AppConfig.API_HOST);
		this.data = new ModData();
		this.lang = new ModLang();
		this._lastUpdated = null;

		this.data.addListener((ev) => {
			switch(ev) {
				case 'tag':
					this.lang.packTags(this.data.tags);
					return;
				case 'affiliation':
					this._lastUpdated = Date.now();
					return;
			}
		});

		let _refs = {toolbar: React.createRef()};
		views.forEach((v) => _refs[v] = React.createRef());
	
		this.state = {
			hasLogin: this.api.hasLogin(),
			view: viewIndex,
			lang: 'ko',
			dataLoaded: false
		}
		this._refs = _refs;

		window.__app = this;

	}

	updateLocale(nextLocale) {
		new Promise((rs,rj)=>{
			this.lang.setDict(nextLocale);
			rs();
		}).then(()=>{ this.setState({lang: nextLocale}); });
		
	}

	updateScreen(nextScreen) {
		this.setState({view: nextScreen});
	}
	
	listViews() {
		let vs = Object.assign(views, {});
		if(this.state.can_input && !vs.indexOf(viewManage)<=0)
			vs.push(viewManage);

		if(this.state.can_admin && vs.indexOf(viewAdmin)<=0)
			vs.push(viewAdmin);
		
		vs = vs.filter((v,vi)=>vs.indexOf(v)===vi);
		return vs;
	}

	_onLoginServerResponseSuccess(resp) {
		this.setState({
			hasLogin: this.api.hasLogin(),
			can_admin: resp.can_admin,
			can_input: resp.can_input,
		}, ()=>{
			this.api.getTags((tags) => {
				this.data.setTags(tags);
			});
		});
	}
	_onLoginServerResponseFailure(err) {
		this.setState({hasLogin: false});
	}
	onLoginCallback(gauth) {
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



	isDataView() {
		return 0<['', viewIndex, viewInfo].indexOf(this.state.view);
	}

	onFilterChange(filter) {
		if(!this._lastUpdated) return;

		let cids = Object.keys(this.data._campaigns).map((cid)=>parseInt(cid));
		this.data.listTagClasses(true, true, true).forEach((cls) => {
			if(filter[cls] && filter[cls]) {
				let tag = this.data.getTag(filter[cls]);
				let filtered = this.data.filterInclude(cls, tag.name);
				cids = cids.filter((cid)=>0<=filtered.indexOf(cid));
			}
		});
		this.data.applyFilter(cids);
	}

	renderHeader() {
		return(
			<AppBar position="sticky" style={styles.appbar}>
				<Toolbar style={styles.toolbar}>
					<div style={styles.toolbarItem}>
						<h1 style={styles.logo}>
							{this.lang.tr('app')}
						</h1>
					</div>
					<div style={styles.toolbarItem}>
						<AppLocale app={this} ref={this.refs.locales} lang={this.state.lang} />
						<AppProfile app={this} ref={this.refs.profile} 
							profile={this.api.userProfile()} 
							permission={{
								can_admin: this.state.can_admin,
								can_manage: this.state.can_manage,
							}}
							update={this.updateScreen.bind(this)} />
					</div>
				</Toolbar>
			</AppBar>
		);
	}

	renderFooter() {
        return (
            <Paper className={this.props.footer} style={styles.footer}>
                <Grid container>
                    <Grid className={this.props.footerSection} item md={4}>
                       
                    </Grid>
                    <Grid className={this.props.footerSection} item md={4}>
                        
                    </Grid>
                    <Grid className={this.props.footerSection} item md={4}>
                        
                    </Grid>
                </Grid>
		    </Paper>
        );
	}
	
	
	renderStage() {
		if(this.state.view==viewAdmin && this.state.can_admin)
			return (<AppAdmin ref={this._refs.viewAdmin} 
				app={this} 
				api={this.api} />);
		else if(this.state.view==viewManage && this.state.can_input)
			return (<AppManage ref={this._refs.viewManage} 
				app={this} 
				api={this.api}
				data={this.data} />);
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
				tools={this._refs.toolbar} />);
	}

	render() {
		if(!this.state.hasLogin)
			return this.renderLoginScreen();

		return (
			<div style={styles.appContainer}>
                {this.renderHeader()}

                <Grid container spacing={32}>
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
					{this.renderStage()}
                </Grid>

				{this.renderFooter()}
            </div>
		);
	}
}
export default App;
