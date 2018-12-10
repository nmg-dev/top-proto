import React, { Component } from 'react';
import { AppBar, Grid, Toolbar, Button, IconButton, Typography, Icon } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';


import AppHead from './components/AppHead.js';
import AppBody from './components/AppBody.js';
import AppFoot from './components/AppFoot.js';

const styles = {
	root: {
		display: 'flex',
		flexGrow: 1
	}
}

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			stage: 'view'
		}
	}

	componentDidMount() {
		console.log('hello world');
		// check for authentication

	}

	onLoginSuccess(resp) 
	{
		console.log('activated', resp);
	}

	onLoginError(err) {
		console.error('error', err);
	}

	render() {
		return (
		  <div className="Application">
		  	<AppHead />
		  	<AppBody  />
		  	<AppFoot />
		  </div>
		);
	}
}
export default withStyles(styles)(App);
