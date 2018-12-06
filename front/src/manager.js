import React, { Component } from 'react';
import { Grid, Paper } from '@material-ui/core';

class Manager extends Component {
	render() {
		return (
			<Grid item xs={12}>
        		<Paper className="manager">
        			Manager view
        		</Paper>
        	</Grid>
		)
	}
}

export default Manager;