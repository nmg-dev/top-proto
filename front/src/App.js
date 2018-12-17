import React, { Component } from 'react';
import { 
		AppBar, 
		Grid, 
		Toolbar, 
		Button, 
		IconButton, 
		Typography, 
		Icon, 
		Paper, 
		Avatar, 
		Chip
	} 
	from '@material-ui/core';




import AppView from './appView.js';
import AppManage from './appManage.js';
import AppAdmin from './appAdmin.js';

const API_HOST = 'http://localhost:8080';

const styles = {
	head: {
		appbar: {
			minHeight: '10vh',
		},
		toolbar: {
			display: 'flex',
			justifyContents: 'between'
		},
		toolbarGrp: {
			display: 'inline-flex',
		},
		icons: {

		}
	},
	root: {
		display: 'flex',
		flexGrow: 1
	}
}

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			stage: 'view',
			user: null,
		}


		window.__app = this;
	}

	componentDidMount() {
		console.log('app mounted');
	}

	componentWillUpdate() {
		// on login
		if(this.state.login!=null) {
			// this._appHead.setState({login: this.state.login});
			console.log(this.__head.current, this.state.login);
			this.__head.current.setState({
				login: this.state.login
			});
			this.state.user = this.state.login;
		}
	}

	componentDidUpdate() {
		console.log(this, this.state);
		// console.log(arguments);
	}

	onSocketOpen(ev) {
		console.log(ev, arguments);
	}

	onSocketReceive(ev) {
		console.log(ev, arguments);
	}

	onSocketClose(ev) {
		console.log(ev, arguments);
	}


	sessionLogin(gauth) {
		let resp = gauth.getAuthResponse();
		let profile = gauth.getBasicProfile();
		fetch(API_HOST + '/auth', {
			method: 'POST',
			body: JSON.stringify({
				id: profile.getId(),
				email: profile.getEmail(),
				token: resp.id_token
			})
		})	.then((plainResp) => plainResp.json())
			.then((userInfo) => {
				console.log('user verified...', userInfo)
				this.setState({user: userInfo});
			})
			.catch((err) => {
				console.error(err);
			});
	}

	renderHeadProfile() {
		if(this.state.user) {
			let pname = this.state.user.profile.name + ' <' + this.state.user.profile.email + '>';
			return (
				<div style={ this.state.user!=null ? {display: 'inline-flex'} : {display: 'none'} }>
					<Chip
						avatar={<Avatar alt={this.state.user.profile.name} src={this.state.user.profile.picture} className={this.props.avatar} />}
						label={pname}
						onClick={this.handleProfileClick}
					/>

					{this.state.user.can_manage ? (
						<Button onClick={()=>{ this.setState({stage: 'manage'}) }}><Icon>build</Icon> Manage </Button>
					) : ''}
					{this.state.user.can_admin ? (
						<Button onClick={()=>{ this.setState({stage: 'admin'}) }}><Icon>accessibility</Icon> Admin</Button>
					) : ''}

				</div>
			);
		} else {
			return (
				<div className="g-signin2" style={ this.state.user!=null ? {display: 'none'} : {display: 'inline-flex'} }
					data-onsuccess="_onGoogleLoginSuccess"
					data-onerror="_onGoogleLoginFailure"
				>
				</div>
			);
		}
	}

	renderHead() {
		return (
			<AppBar position="static" className={this.props.appbar} style={styles.head.appbar}>
				<Toolbar className={this.props.toolbar} style={styles.head.toolbar}>
					<div className={this.props.toolbarGrp} style={styles.head.toolbarGrp}>
						<IconButton style={styles.head.icons}>
							<Icon className={this.props.icons}>menu</Icon>
						</IconButton>
						<Typography variant="h5">TagOperation</Typography>
					</div>
					<div>
						{this.renderHeadProfile()}
					</div>
				</Toolbar>
			</AppBar>
		);
	}

	renderStage() {
		switch(this.state.stage) {
			case 'admin':
				return (<AppAdmin />);
			case 'manage':
				return (<AppManage />);
			case 'view':
			default:
				return (<AppView />);

		}
	}

	renderFoot() {
		return (
			<Paper className={this.props.footer} style={styles.footer}>
				<Grid container className={this.props.gridContainer}>
					<Grid item className={this.props.GridItem} md={4}>
						<Typography variant="h5" className={this.props.footerLogo}>TagOperation</Typography>
						<Typography className={this.props.footerVersion}>proto v1.1</Typography>
						
					</Grid>
					<Grid item className={this.props.GridItem} md={4}>
						<Button>Terms & Conditions</Button>
						<Button>Privacy Policy</Button>
					</Grid>
					<Grid item className={this.props.GridItem} md={4}>
						<Typography variant="h6" className={this.props.footerCopy}>
							by <a href="https://www.nextmediagroup.co.kr" target="_blank">NextMediaGroup</a> since 2018
						</Typography>
					</Grid>
				</Grid>
			</Paper>
		);
	}

	render() {
		return (
		  <div className="Application">
		  	{this.renderHead()}
		  	<Grid container spacing={16}>
		  		<Grid item xs={12} className={this.props.appBody} style={styles.body}>
			  		<Paper className={this.props.bodyContainer} style={styles.bodyContainer}>
			  			{this.renderStage()}
			  		</Paper>
			  	</Grid>
			</Grid>
		  	{this.renderFoot()}
		  </div>
		);
	}
}
export default App;
