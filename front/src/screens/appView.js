import React, { Component } from 'react';
import { List, ListItem, Paper, TextField, MenuItem, Toolbar, Card, CardHeader, CardContent, ListSubheader, Collapse, IconButton, Icon, Button, Grid, Divider, CardActions, Hidden, Chip } from '@material-ui/core';

import plots from './utils/plots.js';
import langs from './utils/langs.js';


import moment from 'moment';


const styles = {
	wrapper : {
		padding: '2vh',
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-evenly',
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

const performanceLayout = {
	width: 300,
	height: 300
};

class AppView extends Component {
	constructor(props) {
		super(props);
		this.tags = {};
		this._tags = {};
		this._campaigns = {};
		this._affs = [];

		this.metrix = [
			{key: 'cpc', calc: (v) => (v.clk/Math.max(1,v.cost)) },
			{key: 'cpa', calc: (v) => (v.cnv/Math.max(1,v.cost)) },
			{key: 'ctr', calc: (v) => (v.clk/Math.max(1,v.imp)) },
			{key: 'cvr', calc: (v) => (v.cnv/Math.max(1,v.imp)) },
			{key: 'cnt', calc: (v) => 1, hide: true },
		];
		this.state = {
			scoremap: {},			// precalculated score
			categories: {},			// categories {category_name : { selected: [tagid, tagid...], open: true | false }}
			showboxes: true,		// show summary boxes
			kpi: this.metrix[0],
			period_from: moment().add(-1, 'year'),
			period_till: moment(),
		}

		this.container = React.createRef();
	}

	// format mean, value
	_fv(num) {
		switch(this.state.kpi.key) {
			case 'cpc':
			case 'cpa':
				return parseFloat(num.toFixed(4)).toLocaleString();
			case 'ctr':
			case 'cvr':
				return (100*num).toFixed(3) + '%';
			default:
				return num.toFixed(4);
		}
	}

	// format redisue, bias
	_fr(num) {
		switch(this.state.kpi.key) {
			case 'cpc':
			case 'cpa':
				return num.toLocaleString();
			case 'ctr':
			case 'cvr':
				return (100*num).toFixed(4) + '%p';
			default:
				return num.toFixed(4);
		}
	}

	procScoreMap(metric, stateChange) {
		console.log('try to update scoremap by '+ metric.key);
		let fn = metric.calc;
		if(!stateChange)
			stateChange = {};
		let scoremap = {};
		
		this._affs.forEach((aff) => {
			let c = this._campaigns[aff.c];
			let t = this._tags[aff.t];
			if(!(c && t)) return;
			// if(!this.tags[aff.t]) return;

			if(t.class=='category') return;

			if(!scoremap[t.class]) scoremap[t.class] = {};
			if(!scoremap[t.class][t.id])
				scoremap[t.class][t.id] = {
					label: t.name,
					i18n: t.i18n,
					priority: t.priority,
					_raws: [],
					score: 0,
					count: 0,
					stdev: 0,
				};
			c.records.forEach((r) => {
				scoremap[t.class][t.id]._raws.push(fn(r));
				// scoremap[t.class][t.id].score += fn(r);
				// scoremap[t.class][t.id].count += 1;
			});
		});

		let categories = this.state.categories;
		Object.keys(scoremap).forEach((cat) => {
			// calculate scoremap
			Object.keys(scoremap[cat]).forEach((tid) => {
				if(0<scoremap[cat][tid]._raws.length) {
					let mean = 0;
					let sdev = 0;
					// count
					scoremap[cat][tid].count = scoremap[cat][tid]._raws.length;
					// average
					scoremap[cat][tid]._raws.forEach((sc) => { mean += sc });
					scoremap[cat][tid].score = mean/scoremap[cat][tid].count;
					// std.dev 
					scoremap[cat][tid]._raws.forEach((sc) => { sdev += Math.pow(sc-scoremap[cat][tid].score,2) });
					scoremap[cat][tid].stdev = sdev/scoremap[cat][tid].count;					
					// clear raw
					// delete(scoremap[cat][tid]._raws);
				} else {
					delete(scoremap[cat][tid]);
				}
			});

			// setup categories state
			if(!categories[cat])
				categories[cat] = { selecteds: [], open: true };
			else
				categories[cat] = { selecteds: categories[cat].selecteds, open: categories[cat].open };
		});

		// DEBUG:
		stateChange.scoremap = scoremap;
		stateChange.categories = categories;
		this.setState(stateChange)
	}

	onTagRetrieved(tdata) {
		let tmap = {};
		Object.keys(tdata).forEach((tid) => {
			let tag = tdata[tid];
			tmap[tag.class] ? tmap[tag.class].push(tag) : tmap[tag.class] = [tag];
		});

		// update state
		// this.setState({tags: tmap, _tags: tdata});
		this._tags = tdata;
		this.tagmap = tmap;
	}

	onCampaignRetrieved(cdata) {
		// link campaign and records
		cdata.records.forEach((rec) => {
			let campaign = cdata.campaigns[rec.c];
			campaign.records ? campaign.records.push(rec) :  campaign.records = [rec];
		});
		this._campaigns = cdata.campaigns;
		this._affs = cdata.affiliations;

		this.procScoreMap(this.state.kpi);
	}

	updateTags() {
		return this.props.api('/t/')
			.then(this.onTagRetrieved.bind(this));
	}

	updateCampaigns() {
		return this.props.api('/c/', {
			method: 'POST', 
			body: JSON.stringify({
				from: this.state.period_from.toDate(),
				till: this.state.period_till.toDate(),
			})
		})
			.then(this.onCampaignRetrieved.bind(this));
	}

	componentDidUpdate() {
	}

	componentDidMount() {
		this.updateTags()
			.then((() => this.updateCampaigns()).bind(this));
	}

	/* render query toolbar */
	renderQuerybar() {
		return (
			<Paper>
				<Toolbar component="nav" style={styles.toolbar}>
					{this.renderCategoryPicker()}
					{this.renderPeriodPicker()}					
					{this.renderKPIPicker()}
				</Toolbar>
			</Paper>
		);
	}
	renderCategoryPicker() {
		return (
				<TextField select
					label="Category"
					value={this.state.category}
					placeholder="default all"
					style={styles.toolbarField}
					InputLabelProps={{shrink: true}}
					onChange={(ev)=> {
						this.setState({category: ev.target.value})
					}}>
					{this.tagmap && this.tagmap.category ?
						this.tagmap.category.map((t) => 
							<MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)
						: ''
					}
				</TextField>
		);
	}
	renderPeriodPicker() {
		return (
			<ListItem>
				<TextField
					type="date"
					value={this.state.period_from.format("YYYY-MM-DD")}
					label="From"
					style={styles.toolbarField}
				/>
				<TextField
					type="date"
					value={this.state.period_till.format("YYYY-MM-DD")}
					label="Till"
					style={styles.toolbarField}
				/>
			</ListItem>
		);
	}
	renderKPIPicker() {
		return (
			<TextField select
				label="KPI"
				value={this.state.kpi.key}
				style={styles.toolbarField}
				InputLabelProps={{shrink: true}}
				onChange={(ev)=> {
					if(ev.target.value) {
						this.metrix.forEach((mx) => {
							if(mx.key == ev.target.value) {
								this.procScoreMap(mx, {kpi: mx});
							}
						});
					}
				}}>
					{this.metrix.map((mx) => !mx.hide ? <MenuItem key={mx.key} value={mx.key}>{mx.key.toUpperCase()}</MenuItem> : '')}
			</TextField>
		)
	}

	/* render summary panel */
	renderSummaryBoxes() {
		let _title = 'Summary of '+this.state.category?this.state.category:'ALL';
		let _subtitle = '';

		Object.keys(this.state.scoremap).forEach((cat) => {
			if(0 < _subtitle.length)
				_subtitle += ', ';
			let scs=this.state.scoremap[cat];
			let bestAt = null;
			// search for best
			Object.keys(scs).forEach((tid) => {
				if(!bestAt || scs[bestAt].score < scs[tid].score)
					bestAt = tid;
			});
			let best = scs[bestAt];
			_subtitle += cat + ':' + langs.trans(this.props.lang, best) + '('+best.score.toFixed(3)+')';
		});
		return (
			<Card style={{marginTop: 8}}>
				<CardHeader 
					title={_title}
					subheader={'Best with: '+ _subtitle}
					action={this.renderCardToggleAction(
						()=>this.setState({showboxes: !this.state.showboxes}),
						()=>this.state.showboxes
					)}
				/>
				<CardContent>
					<Collapse in={this.state.showboxes}>
						{plots.summaryBoxes(this.state.scoremap, { width: 800})}
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
		let cat = ev.target.getAttribute('category');
		let tid = ev.target.getAttribute('tag_id');
		// let scores = this.state.scoremap[cat][tid];
		let categories = this.state.categories;
		console.log(ev, ev.target, ev.currentTarget, cat, tid, this.state.categories);
		if(categories[cat]) {
			let selecteds = categories[cat].selecteds;

			categories[cat] = changes(selecteds, tid, cat);
			this.setState({categories: categories});
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
		mean = this._fv(mean);
		stdev = this._fr(stdev);
		return (
			<CardHeader
				category={cat}
				title={cat.toUpperCase()}
				subheader={<div style={styles.chipContainer}>
					{Object.keys(this.state.scoremap[cat]).map((tid) => 
					<Chip tag_id={tid} category={cat}
						style={0<=this.state.categories[cat].selecteds.indexOf(tid)
							? styles.performanceChipActive 
							: styles.performanceChipDeactive}
						label={langs.trans(this.props.lang, this.state.scoremap[cat][tid])}
						onClick={this.onUpdatePerformanceSelection.bind(this)} 
						title={'mean(' + mean + '), std.dev('+ stdev +')' } />
					)}
					<Hidden mdDown>
						<span style={styles.performanceMean}>{mean}</span>
						<span style={styles.performanceBias}>{stdev}</span>
					</Hidden>
				</div>}
				action={this.renderCardToggleAction(
					this.onUpdatePerformanceOpen.bind(this),
					() => this.state.categories[cat].open
				)}
			/>
		);
	}
	renderPerformanceCardContent(cat) {
		return (<Collapse in={this.state.categories[cat].open}>
			<Grid container spacing={4}>
				<Grid item xs={3}>
					<List>
						{Object.keys(this.state.scoremap[cat]).map((tid) =>
							<ListItem button 
								selected={0<=this.state.categories[cat].selecteds.indexOf(tid)}
								onClick={this.onUpdatePerformanceSelection.bind(this)} 
							>
								{langs.trans(this.props.lang, this.state.scoremap[cat][tid])}
								<Hidden mdDown>
									<span style={styles.performanceMean}>{this._fv(this.state.scoremap[cat][tid].score)}</span>
									<span style={styles.performanceMean}>{this._fr(this.state.scoremap[cat][tid].score)}</span>
								</Hidden>
							</ListItem>
						)}
					</List>
				</Grid>
				<Grid item xs={6}>
					{plots.categoryBars(this.state.scoremap[cat], cat, performanceLayout)}
				</Grid>
			</Grid>
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



	


	renderBarCards() {
		let categories = Object.keys(this.state.scoremap);
		if(0<=categories.indexOf('category'))
			categories.splice(categories.indexOf('category'), 1);
		return (
			<Grid container>
				{categories.map((cat) => this.renderCategoryPerformances(cat))}
			</Grid>
		)
	}


	render() {
		return (
			<main style={styles.wrapper}>
				{this.renderQuerybar()}
				<Divider />
				{this.renderSummaryBoxes()}
				<Divider />
				{this.renderBarCards()}
			</main>
		)
	}

	
};

export default AppView;
