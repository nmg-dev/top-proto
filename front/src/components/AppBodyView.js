import React, { Component } from 'react';
import { Card, Grid } from '@material-ui/core';

import Plot from 'react-plotly.js';

const styles = {

}

class AppBodyView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [
				{
					'x': [1,2,3],
					'y': [2,6,3],
					'type': 'scatter',
					'mode': 'lines+points',
					'marker': { 'color': 'red' }
				},
				{
					type: 'bar',
					x: [1,2,3],
					y: [2,5,3],
				}
			],
	      	layout: {
	      		width: 320, height: 240, title: 'A Fancy Plot' 
	      	}
		};
	}

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
						<Plot data={this.state.data} layout={this.state.layout} />
					</Card>
				</Grid>
			</Grid>
		);
	}
	
}

export default AppBodyView;