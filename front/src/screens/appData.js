import React from 'react';

import moment from 'moment';
import AppView from './appView';
import AppIndex from './appIndex';
import { Paper, Toolbar, TextField, MenuItem, Divider } from '@material-ui/core';


const PredefinedCategories = [
	'category', 'goal', 'channel', 'media'
];

const PredefinedMetrics = [
    {key: 'cpc', calc: (v) => (v.clk/Math.max(1,v.cost)) },
    {key: 'cpa', calc: (v) => (v.cnv/Math.max(1,v.cost)) },
    {key: 'ctr', calc: (v) => (v.clk/Math.max(1,v.imp)) },
    {key: 'cvr', calc: (v) => (v.cnv/Math.max(1,v.imp)) },
    {key: 'cnt', calc: (v) => 1, hide: true },
];

const styles = {};

class AppData extends React.Component {
    constructor(props) {
        super(props);

        // raw values
        this._tags = {};
		this._campaigns = {};
		this._affs = [];
		this._performs = {};

        this.state = {
			kpi: props.defaultMetric ? props.defaultMetric : PredefinedMetrics[0],
			period_from: props.defaultFrom ? props.defaultFrom : moment().add(-1, 'year'),
			period_till: props.defaultTill ? props.defaultTill : moment(),

			scoremap: {},			// precalculated score
			categories: {},			// categories {category_name : { selected: [tagid, tagid...], open: true | false }}
			showboxes: true,		// show summary boxes
		}

		this.querybar = React.createRef();
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
    
    isCategoryPredefined(cat) {
        return 0<=PredefinedCategories.indexOf(cat);
    }

    getDefaultMetric() {
        return PredefinedMetrics[0];
    }


	procScoreMap(metric, stateChange) {
		if(!stateChange)
			stateChange = {};
		if(!metric) {
			metric = this.kpi || PredefinedMetrics[0];
			stateChange.metric = PredefinedMetrics[0];
		}
		let fn = metric.calc;
		

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
		if(cdata.e) {
			window.alert(cdata.e);
			return;
		}
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
    
    renderPredefinePicker(predefinedKey, titleLabel) {
		return (
			<TextField select
				name={predefinedKey}
				label={titleLabel}
				value=""
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
						PredefinedMetrics.forEach((mx) => {
							if(mx.key == ev.target.value) {
								this.resetPerformances();
								this.procScoreMap(mx, {kpi: mx});
							}
						});
					}
				}}>
					{PredefinedMetrics.map((mx) => !mx.hide ? <MenuItem key={mx.key} value={mx.key}>{mx.key.toUpperCase()}</MenuItem> : '')}
			</TextField>
		)
	}
	resetPerformances() {
		Object.keys(this._performs)
			.filter((cat)=>this._performs[cat] && this._performs[cat].current)
			.forEach((cat) => {
				this._performs[cat].current.resetSelecteds();
			});
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

	componentDidMount() {
		this.updateTags()
			.then((() => this.updateCampaigns()).bind(this));
	}

    render() {
		return (
			<div>
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
				<AppView app={this.props.app} data={this} query={this.querybar.current} />
			</div>
		);
    }
}

export default AppData;