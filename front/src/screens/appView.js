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

			cids: [],
			tids: [],
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

				_playout[cls].title = this.props.app.lang.tr(_playout[cls].title);
				_playout[cls].xaxis.ticktext = _playout[cls].xaxis.ticktext.map((tn) =>
					this.props.app.lang.tr(cls + '.' + tn));
			});

			this.setState({ 
				selectedTags : nextTags, 
				pdata: _pdata, 
				playout: _playout,
				tids: Object.keys(nextTags).map((tid)=>parseInt(tid)),
			});
		}
	}

	_onToggleFilterSelection(ev) {
		let tid = parseInt(ev.currentTarget.getAttribute('tagid'));
		let pstate = this.state.selectedTags;
		// console.log(tid, pstate[tid], !pstate[tid]);
		pstate[tid] = !pstate[tid];
		// console.log(tid, pstate[tid]);
		let cids = [];
		let tids = [];

		Object.keys(pstate).map((tid)=>parseInt(tid)).forEach((tid) => {
			if(pstate[tid]) {
				let tag = this._data.getTag(tid);
				cids = cids.concat(tag._c);
			}
		});
		if(cids.length<=0) {
			cids = null;
			tids = null;
		} else {
			cids = this._data._uq(cids);
			tids = this._data.filteredTags(cids);
		}

		this.setState({
			selectedTags: pstate, 
			cids: cids, 
			tids: tids,
		});
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
						title={<Icon>filter</Icon>}
						action={this.renderCardToggleAction(
							()=>this.setState({showFilter: !this.state.showFilter}),
							()=>this.state.showFilter
						)} />
					<CardContent>
						<Collapse in={this.state.showFilter}>
							<Grid container>
								{topClss.map((tc) => 
									(<Grid item xs={6} md={3}>
										<List>
											<ListSubheader>{this.props.app.lang.tr(tc)}</ListSubheader>
											{this.props.data.listTags(tc).map(
												(tag) => <ListItem button
													tagid={tag.id}
													disabled={this.state.tids.indexOf(tag.id)<0}
													onClick={this._onToggleFilterSelection.bind(this)}>
													<Checkbox value={tag.id}
														disabled={this.state.tids.indexOf(tag.id)<0}
														checked={this.state.selectedTags[tag.id]?1:0} />
													{this.props.app.lang.tr(tc + '.' + tag.name)}
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
				<CardHeader title={this.props.app.lang.tr(cls)} />
				<CardContent>
					<Plot 
						title={this.props.app.lang.tr(cls)}
						data={this.state.pdata[cls]} 
						useResizeHandler
						style={{width: '100%', height: '100%'}}
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
