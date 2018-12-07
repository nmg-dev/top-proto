import React, { Component } from 'react';
import { AppBar, Grid, Toolbar, Button, IconButton, Typography, Icon } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import Login from './login.js';
import View from './view.js';
import Manager from './manager.js';
import Admin from './admin.js';

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
	}

	onStage() {
		switch(this.state.stage) {
			case 'login': return (<Login />)
			case 'manage': return (<Manager />)
			case 'admin': return (<Admin />)
			case 'view': 
			default:
				return (<View />)
		}
	}

	

	render() {
		return (
		  <div className="Application">
		  	<AppBar position="static" className={this.props.root}>
		  		<Toolbar>
		  			<Icon className={this.props.icon}>menu</Icon>
		  		</Toolbar>
		  		<Typography variand="h6">
		  			Tag Operation: {this.onStageTitle()}
		  		</Typography>
		  		<Login />
		  	</AppBar>
		    <Grid container spacing={32} className="container">
		    	{this.onStage}
		    </Grid>
		  </div>
		);
	}
}


export default withStyles(styles)(App);
