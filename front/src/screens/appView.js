import React, { Component } from 'react';
import { Paper, TextField, MenuItem, Toolbar, Card, CardHeader, CardContent, ListSubheader, Collapse, IconButton, Icon, Button, Grid, Divider, CardActions, Hidden, Chip, ListItemText, TableHead, TableCell, Table, TableBody, TableRow, List, ListItem } from '@material-ui/core';

import moment from 'moment';

import plots from './utils/plots.js';

import DataTable from './components/dataTable.js';


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
	performanceMean: { color: 'secondary' },
	performanceBias: { color: 'highlight' },
	performanceChipActive: {  },
	performanceChipDeactive: {},

}

class AppView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// show chip filter
			showFilter: true,
			showPerform: {},

			cids: this.props.data.campaigns.map((c)=>c.id),
			tids: this.props.data.tags.map((t)=>t.id),
			clss: this.props.data.listTagClasses(),
		}
	}

	renderCategoryChips() {
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
							<Table>
								<TableHead>
									<TableRow>
										{this.props.data.listTopTagClasses().map((tc) => 
											<TableCell>{tc}</TableCell>
										)}
									</TableRow>
								</TableHead>
								<TableBody>
									<TableRow>
										{this.props.data.listTopTagClasses().map((tc) => 
											<TableCell>
												<List>
													{this.props.data.listTags(tc).map((tag) => 
													<ListItem key={tag.id}>{tag.name}</ListItem>
													)}
												</List>
											</TableCell>
										)}
									</TableRow>
								</TableBody>
							</Table>
						</Collapse>

					</CardContent>
				</Card>
			</Paper>
		)
	}

	/* render summary panel */
	renderSummaryBoxes() {
		let _title = 'Summary of '+this.state.category?this.state.category:'ALL';
		return (
			<Card style={{marginTop: 8}}>
				<CardHeader 
					title={_title}
					action={this.renderCardToggleAction(
						()=>this.setState({showboxes: !this.state.showboxes}),
						()=>this.state.showboxes
					)}
				/>
				<CardContent>
					<Collapse in={this.state.showboxes}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Category</TableCell>
									<TableCell>AVG.</TableCell>
									<TableCell>std.dev.</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{Object.keys(this.state.scoremap).map((cat) => {
									let bs = plots.bestScoredAt(this.state.scoremap, cat);
									let bi = this.state.scoremap[cat][bs];
									return (<TableRow category={cat}>
										<TableCell>{cat}</TableCell>
										<TableCell>{this._fv(bi.score)}</TableCell>
										<TableCell>{this._fr(bi.stdev)}</TableCell>
									</TableRow>);
								})}
							</TableBody>
						</Table>
						<div>
						{plots.summaryBoxes(this.state.scoremap)}
						</div>
					</Collapse>
				</CardContent>
			</Card>
		)
	}
	renderCardToggleAction(onclick, hasSet) {
		return (<IconButton onClick={onclick}><Icon>{hasSet()?'expand_less':'expand_more'}</Icon></IconButton>);
	}

	/* render performance cards */
	onUpdatePerformanceItem(ev, changes) {
		let cat = ev.currentTarget.getAttribute('category');
		let tid = ev.currentTarget.getAttribute('tag_id');
		// let scores = this.state.scoremap[cat][tid];
		let categories = this.state.categories;
		if(categories[cat]) {
			let selecteds = categories[cat].selecteds;
			if(selecteds.indexOf(tid)<0) {
				selecteds.push(tid);
			} else {
				selecteds.splice(selecteds.indexOf(tid), 1);
			}
			categories.selecteds = selecteds;

			// categories[cat] = changes(selecteds, tid, cat);
			this.procScoreMap(this.state.kpi, {categories: categories});
		}
	}
	onUpdatePerformanceSelection(ev) {
		this.onUpdatePerformanceItem(ev, ((selecteds, tid, cat) => {
			if(0<=selecteds.indexOf(tid))
				selecteds.splice(selecteds.indexOf(tid), 1);
			else
				selecteds.push(tid);

			return {selecteds: selecteds, open: this.state.categories[cat].open};
		}).bind(this));
		
	}
	onUpdatePerformanceOpen(ev) {
		this.onUpdatePerformanceItem(ev, ((selecteds, tid, cat) => {
			return {selecteds: selecteds, open: !this.state.categories[cat].open};
		}).bind(this));
	}
	renderPerformanceCardHeader(cat, mean, stdev) {
		return (
			<CardHeader
				category={cat}
				title={cat.toUpperCase()}
				subheader={<div style={styles.chipContainer}>
					<span style={styles.performanceMean}>{this._fv(mean)}</span>
					<span style={styles.performanceBias}>{this._fr(stdev)}</span>
				</div>}
				action={this.renderCardToggleAction(
					this.onUpdatePerformanceOpen.bind(this),
					() => this.state.categories[cat].open
				)}
			/>
		);
	}
	renderPerformanceCardContent(cat) {
		if(!this.state.scoremap[cat])
			return '';
		let scores = plots.categoryValues(this.state.scoremap[cat]);
		let mean = plots.categoryAverage(scores);
		let sdev = plots.categoryStdev(scores, mean);

		this._performs[cat] = React.createRef();

		return (<Collapse in={this.state.categories[cat].open}>
			<DataTable category={cat} ref={this._performs[cat]}
			values={scores} mean={mean} stdev={sdev}
			valueToString={this._fv.bind(this)}
			selecteds={this.state.categories[cat].selecteds}
			onCategorySelect={this.onUpdatePerformanceItem.bind(this)}
			/>
		</Collapse>);
	}
	renderCategoryPerformances(cat) {
		if(this.state.scoremap[cat] && this.state.categories[cat]) {
			let vs = plots.categoryValues(this.state.scoremap[cat]);
			let mean = plots.categoryAverage(vs);
			let stdev = plots.categoryStdev(vs, mean);
			return (
				<Grid item xs={12} md={6} lg={4} style={{marginTop: 4}}>
					<Card>
						{this.renderPerformanceCardHeader(cat, mean, stdev)}
						<CardContent>
							{this.renderPerformanceCardContent(cat)}
						</CardContent>
					</Card>
				</Grid>
			);
		} else {
			return '';
		}
	}

	renderCategoryCards(categories) {
		return (
			<Paper>
				{categories.map((cat) => this.renderCategoryPerformances(cat))}
			</Paper>
		);
	}


	render() {
		console.log('render view');
		return (
			<main style={styles.wrapper}>
				{this.renderCategoryChips()}
				<Divider />
			</main>
		)
	}

	
};

export default AppView;
