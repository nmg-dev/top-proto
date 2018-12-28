import React, { Component } from 'react';
import { List, ListItem, Paper, TextField, MenuItem, Toolbar, Card, CardHeader, CardContent, ListSubheader, Collapse, IconButton, Icon, Button, Grid, Divider, CardActions, Hidden, Chip, ListItemText, TableHead, TableCell, Table, TableBody, TableRow } from '@material-ui/core';

import moment from 'moment';

import plots from './utils/plots.js';
import langs from './utils/langs.js';

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

const performanceLayout = {
	width: 300,
	height: 300
};

const PredefinedCategories = [
	'category', 'goal', 'channel', 'media'
];



class AppView extends Component {
	constructor(props) {
		super(props);
		this.tags = {};
		this._tags = {};
		this._campaigns = {};
		this._affs = [];
		this._performs = {};

		PredefinedCategories.forEach((p) => {
			this[p] = null;
		});

		// this.categoryId = null;
		// this.goalId = null;
		// this.channelId = null;
		this.tagSelections = [];

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

	// intersect two obj
	_jx(o1, o2) {
		let orr = {};
		Object.keys(o1).filter((v)=>o2[v]!==undefined).forEach((k) => {orr[k] = o1[k];});
		return orr;
	}

	// format mean, value
	_fv(num) {
		switch(this.state.kpi.key) {
			case 'cpc':
			case 'cpa':
				return parseFloat(num.toFixed(4)).toLocaleString() + 'KRW';
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
				return '±'+num.toLocaleString();
			case 'ctr':
			case 'cvr':
				return '±'+(100*num).toFixed(4) + '%p';
			default:
				return '±'+num.toFixed(4);
		}
	}

	_filterCampaignIds() {
		let cids = this._campaigns;
		// filter predefineds
		PredefinedCategories.forEach((pf) => {
			let pfv = this[pf];
			if(pfv) {
				cids = this._jx(cids, this._tags[pfv]._c);
			} 
		});

		if(this._performs) {
			Object.keys(this._performs).forEach((cat) => {
				let dt = this._performs[cat].current;
				if(!dt) return;
				let ds = dt.getSelecteds();
				if(ds && 0<ds.length) {
					let uns = {};
					ds.forEach((dss) => {
						uns = Object.assign(this._tags[parseInt(dss)]._c, uns);
					});
					cids = this._jx(cids, uns);
				}
			});
		}
		return cids;
	}

	_filterTagSelecteds(cids) {
		let tags = {};
		Object.keys(cids).forEach((cid) => {
			tags = Object.assign(this._campaigns[cid]._t, tags);
		});
		return tags;
	}

	_filteredScoremap(cids, tids, fn) {
		let scoremap = {};
		this._affs.forEach((a) => {
			if(cids[a.c] && tids[a.t]) {
				let c = this._campaigns[a.c];
				let t = this._tags[a.t];
				if(0<=PredefinedCategories.indexOf(t.class)) return;
				if(!scoremap[t.class]) scoremap[t.class] = {};
				if(!scoremap[t.class][t.id]) {
					scoremap[t.class][t.id] = {
						_id: parseInt(t.id),
						label: t.name,
						i18n: t.i18n,
						priority: t.priority,
						_raws: [],
						score: 0,
						count: 0,
						stdev: 0,
					};
				}
				c.records.forEach((r) => {
					scoremap[t.class][t.id]._raws.push(fn(r));
				});
			}
		});
		return scoremap;
	}

	resetPerformances() {
		Object.keys(this._performs)
			.filter((cat)=>this._performs[cat] && this._performs[cat].current)
			.forEach((cat) => {
				this._performs[cat].current.resetSelecteds();
			});
	}

	procScoreMap(metric, stateChange) {
		let fn = metric.calc;
		if(!stateChange)
			stateChange = {};

		// filter campaigns
		let cids = this._filterCampaignIds();
		// filter tags
		let tids = this._filterTagSelecteds(cids);
		
		// build with records
		let scoremap = this._filteredScoremap(cids, tids, fn);

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

		stateChange.scoremap = scoremap;
		stateChange.categories = categories;
		
		this.setState(stateChange);
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
		// mapping cids
		this._affs.forEach((a) => {
			if(!(this._campaigns[a.c] && this._tags[a.t])) return;
			// push maps
			if(!this._tags[a.t]._c)
				this._tags[a.t]._c  = {};
			this._tags[a.t]._c[a.c] = this._campaigns[a.c];
			if(!this._campaigns[a.c]._t)
				this._campaigns[a.c]._t = {};
			this._campaigns[a.c]._t[a.t] = this._tags[a.t];
		});

		this.resetPerformances();
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
					{this.renderPredefinePicker('category')}
					{this.renderPredefinePicker('goal')}
					{this.renderPredefinePicker('channel')}
					{this.renderPredefinePicker('media')}
				</Toolbar>
				<Toolbar component="nav" style={styles.toolbar}>
					{this.renderPeriodPicker()}
					{this.renderKPIPicker()}
				</Toolbar>
			</Paper>
		);
	}
	renderPredefinePicker(predefinedKey, titleLabel) {
		return (
			<TextField select
				name={predefinedKey}
				label={predefinedKey}
				value={this[predefinedKey]}
				style={styles.toolbarField}
				InputLabelProps={{shrink: true}}
				onChange={(ev) => {
					let pfk = ev.target.name;
					this[pfk] = ev.target.value;
					this.resetPerformances();
					this.procScoreMap(this.state.kpi);
				}}>
				<MenuItem key="" value={null}> - </MenuItem>
				<Divider />
				{this.tagmap && this.tagmap[predefinedKey] ? this.tagmap[predefinedKey].map((t) => (<MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)) : ''}
			</TextField>
		)
	}
	
	renderPeriodPicker() {
		return (
			<div>
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
			</div>
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
								this.resetPerformances();
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



	


	renderBarCards() {
		let categories = Object.keys(this.state.scoremap).filter((cat)=>PredefinedCategories.indexOf(cat)<0);
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
