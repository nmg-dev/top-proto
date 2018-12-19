import React, { Component } from 'react';
import { List, ListItem, Paper, TextField, MenuItem, Toolbar, Card, CardHeader, CardContent, ListSubheader, Collapse, IconButton, Icon, Button, Grid, Divider } from '@material-ui/core';

import plots from './utils/plots.js';
import langs from './utils/langs.js';


import moment from 'moment';

const styles = {
	wrapper : {
		padding: '2vh',
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
			showmap: {},
			kpi: this.metrix[0],
			period_from: moment().add(-1, 'year'),
			period_till: moment(),
		}

		this.container = React.createRef();
	}

	procScoreMap() {
		let fn = this.state.kpi.calc;
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
					delete(scoremap[cat][tid]._raws);
				} else {
					delete(scoremap[cat][tid]);
				}
			});
		});

		console.log(scoremap);

		this.setState({scoremap: scoremap})
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

		this.procScoreMap();
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

	renderQuerybar() {
		return (
			<Paper>
				<Toolbar component="nav">
					{this.renderCategoryPicker()}
					{this.renderPeriodPicker()}					
				</Toolbar>
			</Paper>
		);
	}

	renderCategoryPerformances(cat) {
		let vs = plots.categoryValues(this.state.scoremap[cat]);
		let average = plots.categoryAverage(vs);
		let stdev = plots.categoryStdev(vs, average);

		return (
			<Grid item xs={12} style={{margin: 4}}>
				<Card>
					<CardHeader 
						title={cat.toUpperCase()}
						subtitle={'Avg.('+average.toFixed(3)+'), Std.Dev.('+stdev.toFixed(6)+')'}
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

	renderQueryCard(history) {

	}

	renderSummaryPanel() {
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
				{this.renderSummaryPanel()}
			</main>
		)
	}

	
};

export default AppView;
