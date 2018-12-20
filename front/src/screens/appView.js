import React, { Component } from 'react';
import { List, ListItem, Paper, TextField, MenuItem, Toolbar, Card, CardHeader, CardContent, ListSubheader, Collapse, IconButton, Icon, Button, Grid, Divider, CardActions } from '@material-ui/core';

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
	summaryGrid: {
		maxHeight: 84,
		overflowY: 'auto',
	},
	summaryPaper: {
		marginTop: 16,
	}


}



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
			scoremap: {},
			showmap: null,
			showboxes: true,
			kpi: this.metrix[0],
			period_from: moment().add(-1, 'year'),
			period_till: moment(),
		}

		this.container = React.createRef();
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

		Object.keys(scoremap).forEach((cat) => {
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
		});

		console.log(scoremap);
		stateChange.scoremap = scoremap;
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

	componentDidUpdate() {
	}

	componentDidMount() {
        this.props.api('/t/')
			.then(this.onTagRetrieved.bind(this))
			.then(() => {
				this.props.api('/c/', {
					method: 'POST', 
					body: JSON.stringify({
						from: this.state.period_from.toDate(),
						till: this.state.period_till.toDate(),
					})
				})
					.then(this.onCampaignRetrieved.bind(this));
			})

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
					placeholder="default all"
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
			</ListItem>
		);
	}

	renderPeriodPicker() {
		return (
			<ListItem>
				<TextField
					type="date"
					value={this.state.period_from.format("YYYY-MM-DD")}
					label="From"
				/>
				<TextField
					type="date"
					value={this.state.period_till.format("YYYY-MM-DD")}
					label="Till"
				/>
			</ListItem>
		);
	}

	renderKPIPicker() {
		return (
			<TextField select
				label="KPI"
				value={this.state.kpi.key}
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

	renderCategoryPerformances(cat) {
		let vs = plots.categoryValues(this.state.scoremap[cat]);
		let average = plots.categoryAverage(vs);
		let stdev = plots.categoryStdev(vs, average);

		return (
			<Grid item xs={12} style={{marginTop: 4}}>
				<Card>
					<CardHeader 
						title={cat.toUpperCase()}
						subheader={'Avg.('+average.toFixed(3)+'), Std.Dev.('+stdev.toFixed(6)+')'}
					/>
					<CardContent>
						<Toolbar>
						{vs.map((v) => (<MenuItem key={v.tid}>{langs.trans(this.props.lang, v)} :{v.score}</MenuItem>))}
						</Toolbar>
						<Divider />
						{plots.categoryBars(this.state.scoremap[cat], cat, { })}
					</CardContent>
				</Card>
			</Grid>
		);
	}

	renderSummaryBoxToggleButton() {
		return (<IconButton onClick={() => this.setState({showboxes: !this.state.showboxes})}><Icon>{this.state.showboxes?'expand_less':'expand_more'}</Icon></IconButton>);
	}

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
					action={this.renderSummaryBoxToggleButton()}
				/>
				<CardContent>
					<Collapse in={this.state.showboxes}>
						{plots.summaryBoxes(this.state.scoremap, { width: 800})}
					</Collapse>
				</CardContent>
			</Card>
		)
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
