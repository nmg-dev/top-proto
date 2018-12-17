import React, { Component } from 'react';
import { Card, CardHeader, CardContent, Grid, Chip, Icon, Paper, TextField, MenuItem } from '@material-ui/core';


import Plot from 'react-plotly.js';
const moment = require('moment');

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
			summary: {
				spending: 10000000,
				cpc: 12,
				cvr: 30,
				ctr: 20,
			},
			plots: {
				scatter: {
					data: [
						{ x: [10], y: [5], marker: { size: 10}, mode: 'points', },
						{ x: [5], y: [1], marker: { size: 5}, mode: 'points', },
						{ x: [7], y: [7], marker: { size: 7}, mode: 'points', },
						{ x: [8], y: [9], marker: { size: 9}, mode: 'points', },
						{ x: [4], y: [8], marker: { size: 2}, mode: 'points', },
					],
					layout: {
						width: '100%', 
						height: '30vh', 
						title: 'Per Campaign'
					}
				},
				main: {
					
					data: [
						{ 
							x: [1,2,3,4,5,6,7],
							y: [10,20,30,30,30,50],
							type: 'bar',
							marker: { color: 'red' },
						},
						{
							x: [1,2,3,4,5,6,7],
							y: [5,6,6,2,4,5,6],
							type: 'scatter',
							mode: 'lines+points',
							marker: { color: 'blue' },
						}
					],
					layout: {
						width: '100%', 
						height: '40vh', 
						title: 'Daily'
					}
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
							<TextField type="date" label="from" value={moment().add(-7, 'day').format('YYYY-MM-DD')} />
							 - 
							<TextField type="date" label="till" value={moment().format('YYYY-MM-DD')} />
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
							<TextField select>
								
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
							{this.renderHeaderCard('money', 'Spending', '지출 - KRW', this.state.summary.spending)}
							{this.renderHeaderCard('money_off', 'CPC', '클릭당 지출 - KRW/Click', this.state.summary.cpc)}
							{this.renderHeaderCard('touch_app', 'CTR', '클릭 진행률 (%)', this.state.summary.ctr)}
							{this.renderHeaderCard('tab_unselected', 'CVR', '전환율 (%)', this.state.summary.cvr)}
						</Grid>
					</Paper>
					<Paper>
						<Card>
							<CardHeader>
								<h1>Campaign Charts</h1>
							</CardHeader>
							<CardContent>
								<Plot data={this.state.plots.scatter.data} layout={this.state.plots.scatter.layout} />
								<Plot data={this.state.plots.main.data} layout={this.state.plots.main.layout} />
							</CardContent> 

						</Card>
					</Paper>
				</Grid>
			</Grid>
		);
	}
};

export default AppView;
