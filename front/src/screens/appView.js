import React, { Component } from 'react';
import { ListSubheader, List, ListItem, Grid, Paper, TextField, MenuItem, Toolbar } from '@material-ui/core';


import Plot from 'react-plotly.js';
import moment from 'moment';

const styles = {
	wrapper : {
		padding: '2vh',
	},
	drawer: {
		flexShrink: 0,
	}
}

class AppView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			drawerGrid: 4,
			histories: [],
				
			tags: [],
			campaigns: [],

			category: '',
			period_from: moment().add(-1, 'year').format('YYYY-MM-DD'),
			period_till: moment().format('YYYY-MM-DD'),
		}

		this.container = React.createRef();
	}

	onCategoriesRetrieved(cats) {
		let tts = [];
		Object.keys(cats).forEach((cid) => {
			tts.push(cats[cid]);
		});
		this.setState({tags: tts});
	}

	onTagClassRetrieved(tcls) {

	}

	componentDidMount() {
		console.log('start retrieve');
		this.props.api('/t/category')
            .then(this.onCategoriesRetrieved.bind(this))
        this.props.api('/t/')
			.then(this.onTagClassRetrieved.bind(this));

	}

	showDrawerMode() {

	}

	onDrawerClose(ev) {

	}

	renderCategoryPicker() {
		return (
			<ListItem>
				
				<TextField select
					label="Category"
					value={this.state.category}
					onChange={(ev)=> {
						console.log(ev.target.value);
						this.setState({category: ev.target.value})
					}}>
					{this.state.tags.map((t)=> (
						<MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
					))}
				</TextField>
			</ListItem>
		);
	}

	renderPeriodPicker() {
		return (
			<ListItem>
				<TextField
					type="date"
					value={this.state.period_from}
					label="From"
				/>
				<TextField
					type="date"
					value={this.state.period_till}
					label="Till"
				/>
			</ListItem>
		);
	}

	renderQuerybar() {
		return (
			<Toolbar
				component="nav"
			>
				{this.renderCategoryPicker()}
				{this.renderPeriodPicker()}				
			</Toolbar>
		);
	}

	renderQueryCard(history) {

	}

	render() {
		return (
			<main style={styles.wrapper}>
				<Paper>{this.renderQuerybar()}</Paper>
				<Grid container>
					<Grid item xs={12}>
						<Paper>
							<Grid container ref={this.container}>
								{this.state.histories.map(this.renderQueryCard)}
							</Grid>
						</Paper> 
					</Grid>
				</Grid>
				
				
			</main>
		)
	}

	
};

export default AppView;
