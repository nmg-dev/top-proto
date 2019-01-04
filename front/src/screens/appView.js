import React, { Component } from 'react';
import { Paper, Card, CardHeader, CardContent, ListSubheader, Collapse, IconButton, Icon, Button, Grid, Divider, CardActions, Hidden, Chip, ListItemText, TableHead, TableCell, Table, TableBody, TableRow, List, ListItem, ListItemSecondaryAction, Checkbox } from '@material-ui/core';

import Plot from 'react-plotly.js';


const styles = {
	wrapper : {
		padding: '2vh',
	},
	toolbar: {
		display: 'flex',
		alignItems: 'stretch',
		justifyContent: 'space-between',
		padding: 16,

	},
	toolbarField: {
		minWidth: '10vw',
	},
	summaryGrid: {
		maxHeight: 84,
		overflowY: 'auto',
	},
	summaryPaper: {
		marginTop: 16,
	},
	chipContainer: {
		display: 'flex',
		alignItems: 'baseline',
		justifyContent: 'flex-start'
	},

	pCardSheet: {
		marginTop: 16,
	},

	pCard: {
	},
	performanceMean: { color: 'secondary' },
	performanceBias: { color: 'highlight' },
	performanceChipActive: {  },
	performanceChipDeactive: {},

}

const plotLayout = {
	

}

class AppView extends Component {
	constructor(props) {
		super(props);

		// alias
		this._data = props.data;

		let tcmap = {};
		this._data.listTagClasses(true).forEach((tc) => {
			tcmap[tc] = {};
		});
		this.state = {
			// show chip filter
			showFilter: true,
			showPerform: {},
			selectedTags: tcmap,

			pdata: {},
			playout: {},

			cids: null,
			tids: null,
		}

		this._data.addListener(this._onDataUpdated.bind(this));
	}

	componentDidMount() {
        this._onDataUpdated('affiliation');
    }

	_onDataUpdated(ev) {
		if(ev=='affiliation') {
			let nextTags = {};
			this._data.listTagClasses(true).forEach((tc) => {
				this._data.listTags(tc).forEach((t) => {
					nextTags[t.id] = true
				});
			});

			let metric = this.props.tools.current.getMetric();
			let clss = this._data.listTagClasses(true);
			let _pdata = {};
			let _playout = {};
			clss.forEach((cls)=> {
				let pv = this._data.plotClassbars(metric, 
					cls, 
					this.state.cids, 
					this.state.tids);
				_pdata[cls] = pv.d;
				_playout[cls] = pv.l;
			});

			this.setState({ selectedTags : nextTags, pdata: _pdata, playout: _playout });
		}
	}

	_onToggleFilterSelection(ev) {
		let tid = parseInt(ev.target.getAttribute('tagid'));
		let pstate = this.state.selectedTags;
		pstate[tid] = !pstate[tid];
		this.setState({selectedTags: pstate});
	}
	renderCardToggleAction(onclick, hasSet) {
		return (<IconButton onClick={onclick}><Icon>{hasSet()?'expand_less':'expand_more'}</Icon></IconButton>);
	}
	renderCategoryFilterPane() {
		let topClss = this.props.data.listTopTagClasses();
		console.log(this.state.selectedTags);
		return (
			<Paper>
				<Card>
					<CardHeader
						title={'filter'}
						action={this.renderCardToggleAction(
							()=>this.setState({showFilter: !this.state.showFilter}),
							(err)=>console.error(err)
						)} />
					<CardContent>
						<Collapse in={this.state.showFilter}>
							<Grid container>
								{topClss.map((tc) => 
									(<Grid item xs={6} md={3}>
										<List>
											<ListSubheader>{tc}</ListSubheader>
											{this.props.data.listTags(tc).map(
												(tag) => <ListItem button
													tagid={tag.id}
													onClick={this._onToggleFilterSelection.bind(this)}>
													<Checkbox tagid={tag.id} 
															checked={this.state.selectedTags[tag.id]}
															onChange={this._onToggleFilterSelection.bind(this)} />
													{tag.name}
												</ListItem>
											)}
										</List>
									</Grid>)
								)}
							</Grid>
						</Collapse>
					</CardContent>
				</Card>
			</Paper>
		)
	}

	renderPerformanceCard(cls) {

		return (
			<Card style={styles.pCard}>
				<CardHeader title={cls} />
				<CardContent>
					<Plot 
						title={cls}
						data={this.state.pdata[cls]} 
						layout={this.state.playout[cls]} 
						useResizeHandler={true} />
				</CardContent>
			</Card>
		);
	}

	render() {
		return (
			<main style={styles.wrapper}>
				{this.renderCategoryFilterPane()}
				<Divider />
				<Grid container spacing={8}>
					{this._data.listTagClasses(true).map((cls) => (
						<Grid item xs={12} sm={6} lg={3}>
							{this.renderPerformanceCard(cls)}
						</Grid>	
					))}
				</Grid>
				<Divider />
				<Grid container spacing={8}>
						
				</Grid>
			</main>
		)
	}

	
};

export default AppView;
