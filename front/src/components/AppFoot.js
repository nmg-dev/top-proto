import React, { Component } from 'react';
import { Paper, Card, Grid, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import AppPart from './AppPart.js';

const styles = {
	footer: {
		display: block
	},
	gridContainer: {

	},
	gridItem: {

	},

	footerLogo: {

	},
	footerCopy: {

	},
	footerVersion: {

	}
}

class AppFoot extends AppPart {
	constructor(props) { 
		super(props);
	}

	onAppStageUpdated(stage, prevStage=null) {
		
	}

	render() {
		return (
			<Paper className={this.props.footer}>
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
}

export default withStyles(styles)(AppFoot)