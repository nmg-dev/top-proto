import React, { Component } from 'react';
import { Card, CardHeader, CardContent, Grid, Chip, Icon, Paper, TextField, MenuItem } from '@material-ui/core';

import Plot from 'react-plotly.js';

class AppView extends Component {

	constructor(props) {
		super(props);

		this.state = {
			options: {
				default: '',
				selected: null,
				query: [
				],
				data: [
					{label: 'option1', value: '1'},
					{label: 'option2', value: '2'},
					{label: 'option3', value: '3'},
					{label: 'option4', value: '4'},
					{label: 'option5', value: '5'},
				]
			},
			main: {
				spending: 100,
				cpc: 0,
				cvr: 0,
				ctr: 0,
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
					width: '100%', 
					height: 240, 
					title: 'A Fancy Plot'
				}
			}
		};
	}

	renderPrimarySearch() {
		return (
			<div>
				<Card>
					<CardHeader
						avatar={<Icon>search</Icon>}
						title="Search Query" />
					<CardContent>
						{this.state.options.query.map((q) => (
							<Chip>{q}</Chip>
						))}
					</CardContent>
				</Card>
				<Card>
					<CardHeader title="Put Options" />
					<CardContent>
						<div>
							<TextField type="date" label="from" />
							 - 
							<TextField type="date" label="till" />
						</div>
						<div>
							<TextField select 
								value={this.state.options.default}
								label="Attribution"
							>
								{this.state.options.data.map((opt) => (
									<MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
								))}
							</TextField>
							<TextField select
								label="Attribute Value"
							>
							</TextField>
						</div>
					</CardContent>
				</Card>
			</div>

		);
	}

	renderHeaderCard(icon, title, subtitle, content) {
		let _avatar = (<Icon>{icon}</Icon>);
		return (
			<Grid item xs={6} md={3}>
				<Card>
					<CardHeader
						avatar={_avatar}
						title={title}
						subtitle={subtitle}
					/>
					<CardContent>{content}</CardContent>
				</Card>
			</Grid>
		);
	}

	render() {
		return (
			<Grid container spacing={16}>
				<Grid item md={4}>
					<Paper>
						<Card>{this.renderPrimarySearch()}</Card>
					</Paper>
				</Grid>
				<Grid item md={8}>
					<Paper>
						<Grid container>
							{this.renderHeaderCard('money', 'Spending', '지출 - KRW', this.state.main.spending)}
							{this.renderHeaderCard('money_off', 'CPC', '클릭당 지출 - KRW/Click', this.state.main.cpc)}
							{this.renderHeaderCard('touch_app', 'CTR', '클릭 진행률 (%)', this.state.main.ctr)}
							{this.renderHeaderCard('tab_unselected', 'CVR', '전환율 (%)', this.state.main.cvr)}
						</Grid>
					</Paper>
					<Paper>
						<Card>
							<Plot data={this.state.main.data} layout={this.state.main.layout} />
						</Card>
					</Paper>
				</Grid>
			</Grid>
		);
	}
};

export default AppView;