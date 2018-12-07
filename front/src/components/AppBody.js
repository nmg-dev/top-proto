import React, { Component } from 'react';
import { Paper, Card } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import AppPart from './AppPart.js';

const styles = {
	bodyContainer: {

	}
}

class AppBody extends AppPart {
	constructor(props) { 
		super(props);
	}

	onAppStageUpdated(stage, prevStage=null) {
		
	}

	contents() { 
		return (<h1>Panel</h1>);
	}

	render() {
		return (
			<Paper className={this.props.bodyContainer}>
			{this.contents}
			</Paper>
		);
	}
}

export default withStyles(styles)(AppBody)