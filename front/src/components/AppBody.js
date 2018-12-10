import React, { Component } from 'react';
import { Paper, Card } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import AppPart from './AppPart.js';
import { GoogleLogin } from 'react-google-login';

const styles = {
	bodyContainer: {
		'min-height': '100vh'
	}
}

const onLoginSuccess = function(resp) {
	console.log(resp);
}

const onLoginError = function(err) {
	console.error(err.error);
}

class AppBody extends AppPart {
	constructor(props) { 
		super(props);

	}

	onAppStageUpdated(stage, prevStage=null) {
		
	}

	componentDidMount() {
		console.log(window.gapi);
		window.gapi.load('client:auth2', this.initClient)
		
	}

	initClient() {
		window.gapi.client.init({
			clientId: document.querySelector('[name="google-signin-client_id"]').getAttribute('content'),
			scope: [
				'https://www.googleapis.com/auth/userinfo.email', 
				'https://www.googleapis.com/auth/userinfo.profile', 
				'https://www.googleapis.com/auth/plus.me'
			],
			discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
		})
			.then((rs) => { console.log(rs); });
	}

	contents() {
		return (
			<div className="g-signin2" >
			</div>
		);
	}

	render() {
		return (
			<Paper className={this.props.bodyContainer}>
				{this.contents()}
			</Paper>
		);
	}
}

export default withStyles(styles)(AppBody)