import React, { Component } from 'react';
import { Grid, Paper } from '@material-ui/core';

class View extends Component {
	render() {
		return (
			<Grid item xs={12}>
        		<Paper className="index">
        			Index View
        		</Paper>
        	</Grid>
		)
	}
}

export default View;
