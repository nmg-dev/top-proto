import React, { Component } from 'react';
import { Card, CardHeader, CardContent, ListSubheader, Collapse, IconButton, Icon, Grid, List, ListItem, Checkbox } from '@material-ui/core';

import Plot from 'react-plotly.js';


const styles = {
	filterCard: {
		margin: '2vh',
	},
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

	selectedTids() {
		return Object.keys(this.state.selectedTags)
			.map((tid)=>parseInt(tid))
			.filter((tid)=>this.state.selectedTags[tid]);
	}
	
	buildChartData() {
		let metric = this.props.tools.current.getMetric();
		let clss = this._data.listTagClasses(true);
		let _pdata = {};
		clss.forEach((cls)=> {
			let pv = this._data.plotClassbars(metric, 
				cls, 
				this.state.cids, 
				this.selectedTids());
			_pdata[cls] = pv.d;
		});

		return _pdata;
	}

	buildChartLayout() {
		let metric = this.props.tools.current.getMetric();
		let clss = this._data.listTagClasses(true);
		let _playout = {};
		clss.forEach((cls)=> {
			let pv = this._data.plotClassbars(metric, 
				cls, 
				this.state.cids, 
				this.selectedTids());
			_playout[cls] = pv.l;
			_playout[cls].xaxis.ticktext = _playout[cls].xaxis.ticktext.map((tn) =>
				this.props.app.lang.tr(cls + '.' + tn));
		});
		return _playout;
	}

	_onDataUpdated(ev) {
		if(ev=='affiliation') {
			let nextTags = {};
			this._data.listTagClasses(true).forEach((tc) => {
				this._data.listTags(tc).forEach((t) => {
					nextTags[t.id] = true
				});
			});

			this.setState({ 
				selectedTags : nextTags, 
				pdata: this.buildChartData(), 
				playout: this.buildChartLayout(),
				cids: this._data.campaigns.map((c)=>c.id),
				tids: Object.keys(nextTags).map((tid)=>parseInt(tid)),
			});
		}
	}

	_onToggleFilterSelection(ev) {
		let selectedTid = parseInt(ev.currentTarget.getAttribute('tagid'));
		let pstate = this.state.selectedTags;
		let tids = this.state.tids;
		let tag = this._data.getTag(selectedTid);

		let cids = this.state.cids;

		pstate[selectedTid] = !pstate[selectedTid];

		// on toggle up
		if(pstate[selectedTid]) {
			let fullCids = this._data.campaigns.map((c)=>c.id);
			let appends = tag._c.filter((cid)=>0<=fullCids.indexOf(cid));
			cids = this._data._uq(cids.concat(appends)).sort();

			// let appends = tag._c.filter((cid)=>this._data.hasCampaignId(cid));
			// cids = this._data._uq(cids.concat(appends)).sort();
			tids.push(tag.id);
		} 
		// on toggle down
		else {
			cids = cids.filter((cid)=>tag._c.indexOf(cid)<0);
			tids.splice(tids.indexOf(tag.id), 1);
		}

		this.setState({
			selectedTags: pstate,
			pdata: this.buildChartData(),
			playout: this.buildChartLayout(),
			cids: cids, 
			tids: tids,
		});
	}
	renderCardToggleAction(onclick, hasSet) {
		return (<IconButton onClick={onclick}><Icon>{hasSet()?'expand_less':'expand_more'}</Icon></IconButton>);
	}
	renderCategoryFilterPane() {
		let topClss = this.props.data.listTopTagClasses();
		return (<Card style={styles.filterCard}>
				<CardHeader
					title={<Icon>filter</Icon>}
					action={this.renderCardToggleAction(
						()=>this.setState({showFilter: !this.state.showFilter}),
						()=>this.state.showFilter
					)} 
					subheader={<div>
						<span className="mean"></span>
						<span className="median"></span>
						<span className="std.dev"></span>
					</div>}
					/>
				<CardContent>
					<Collapse in={this.state.showFilter}>
						<Grid container spacing={8}>
							{topClss.map((tc) => 
								(<Grid item xs={6} md={3}>
									<List>
										<ListSubheader>{this.props.app.lang.tr(tc)}</ListSubheader>
										{this.props.data.listTags(tc).map(
											(tag) => <ListItem button
												tagid={tag.id}
												onClick={this._onToggleFilterSelection.bind(this)}>
												<Checkbox value={tag.id}
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
			</Card>);
	}

	renderPerformanceCard(cls) {
		return (
			<Card style={styles.filterCard}>
				<CardHeader title={this.props.app.lang.tr(cls)} />
				<CardContent>
					<Plot 
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
		return (<Grid item xs={12}>
				{this.renderCategoryFilterPane()}
				<Grid container spacing={4}>
				{this._data.listTagClasses(true).map((cls) => (
					<Grid item xs={12} sm={6} lg={3}>
						{this.renderPerformanceCard(cls)}
					</Grid>	
				))}
				</Grid>
			</Grid>
		);
	}

	
};

export default AppView;
