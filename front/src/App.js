import React, { Component } from 'react';
import { Grid } from '@material-ui/core';

import Login from './login.js';
import View from './view.js';
import Manager from './manager.js';
import Admin from './admin.js';


class App extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		console.log('hello world');
	}
	render() {
		return (
		  <div className="Application">
		    <Grid container spacing={32} className="container">
		    	<Login />
		    	<View />
		    	<Manager />
		    	<Admin />
		    </Grid>
		  </div>
		);
	}
}

const styles = {

}

export default App;
