import React, { Component } from 'react';
import { Card, Grid } from '@material-ui/core';

const styles = {

}

class AppBodyAdmin extends Component {
	render() {
		return (
			<Grid container spacing={16}>
				<Grid item md={4}>
					<Card>
						query
					</Card>
					<Card>
						subquery
					</Card>
				</Grid>
				<Grid item md={8}>
					<Card>
					</Card>
				</Grid>
			</Grid>
		);
	}
	
}

export default AppBodyAdmin;