import React, { Component } from 'react';
import { Paper, Card, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import AppPart from './AppPart.js';

import AppBodyView from './AppBodyView.js';
import AppBodyManage from './AppBodyManage.js';
import AppBodyAdmin from './AppBodyAdmin.js';

const styles = {
	bodyContainer: {
		'min-height': 'calc(80vh - 64px)',
		'padding': 32,
	}
}

class AppBody extends AppPart {
	constructor(props) { 
		super(props);
	}

	onAppStageUpdated(stage, prevStage=null) {
		
	}

	// componentDidMount() {
	// 	// call when authentication completed
	// 	if(this.state.user) {
	// 		// TODO: request data
	// 	}
	// }

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

	renderStatge() {
		switch(this.state.stage) {
			case 'view':
			default:
				return <AppBodyView />
				
		}
	}
	render() {

		return (
			<Paper className={this.props.bodyContainer} style={styles.bodyContainer}>
				{this.renderStage()}		
			</Paper>
		);
	}
}

export default AppBody;