import React, { Component } from 'react';
import { Grid, Paper } from '@material-ui/core';
import GoogleLogin from 'react-google-login';

class Login extends Component {
	constructor(props) {
		super(props);
	}

	onLoginSuccess(resp) {
		console.log(resp);
	}

	onLoginError(err) {
		console.error(err.error);
	}

	render() {
		return (
			<Grid item xs={12}>
        		<Paper className="login">
        			<div className="g-signin2" 
        			data-onsuccess="onLoginSuccess" 
        			data-onfailure="onLoginError">
        			</div>
        		</Paper>
        	</Grid>
		)
	}
}

function onLoginSuccess(resp) {
	console.log(resp);
}

function onLoginError(err) {
	console.error(err.error);
}

export default Login;
