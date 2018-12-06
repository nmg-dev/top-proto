import React, { Component } from 'react';
import { Grid, Paper } from '@material-ui/core';

class Admin extends Component {
	render() {
		return (
			<Grid item xs={12}>
        		<Paper className="admin">
        			Admin view
        		</Paper>
        	</Grid>
		)
	}
}

export default Admin;