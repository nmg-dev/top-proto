import React from 'react'
import { Toolbar, Paper, TextField, MenuItem, Divider, CardHeader, CardContent, Card } from '@material-ui/core'

import moment from 'moment'

const styles = {
	paper: {
		margin: '2vh'
	},
	toolbar : {
		display: 'flex',
		justifyContent: 'space-between'
	},
	toolbarField: {
		minWidth: '5vw'
	},
	toolbarFieldLabel: {
		shrink: true
	},
	toolbarGroup: {
		display: 'inline-flex',
	}

};


class AppTools extends React.Component {
    constructor(props) {
		super(props);

		// alias
		this._app = this.props.app;
		this._data = this.props.data;
		// this._tools = this.props.tools;

        let _state = {
            kpi: null,
			period_from: null,
			period_till: null,
		};
		this._data.listPredefinedCategories().forEach((c) => { _state[c] = null });
		this.state = _state;

		this._listTags = this._data.listTags.bind(this._data);

		this._data.addListener((ev) => {
			if(ev=='tag') {
				this.setState({ 
					kpi: props.data.defaultMetric(),
					period_from: props.data.defaultPeriodFrom(),
					period_till: props.data.defaultPeriodTill(),
				}, this.onPeriodChanged.bind(this));
			}
		});
	}

	getMetric() {
		return this.state.kpi ? this.state.kpi : this._data.defaultMetric();
	}

	componentDidUpdate() {
		this.props.onChange(this.state);
	}

	onPeriodChanged() {
		if(this.state.period_from && this.state.period_till) {
			this.props.api.getCampaigns({
				from: this.state.period_from.toDate(),
				till: this.state.period_till.toDate(),
			}, 
				this._onCampaignDataLoadSuccess.bind(this),
				this._onCampaignDataLoadFailure.bind(this));
		}
	}

	_onCampaignDataLoadSuccess(cdata) {
		this._data.setCampaigns(cdata);
	}

	_onCampaignDataLoadFailure(err) {
		console.error(err);
	}

	/* render query toolbar */
	render() {
		return (
			<Paper style={styles.paper}>
				<Toolbar component="nav" style={styles.toolbar}>
					<div style={styles.toolbarGroup}>
					{this._data.listPredefinedCategories().map((pc) => 
						(<TextField select
								name={pc}
								label={this.props.app.lang.tr(pc)}
								value={this.state[pc]}
								style={styles.toolbarField}
								InputLabelProps={styles.toolbarFieldLabel}
								onChange={(ev) => {
									this.setState({[ev.target.name]: ev.target.value});
								}}>
								<MenuItem key="" value={0}> - </MenuItem>
								<Divider />
									{this._listTags(pc).map(
										(t) => (<MenuItem 
											key={t.id} 
											value={t.id}>
											{this.props.app.lang.tr(pc + '.' + t.name)}
										</MenuItem>))}
							</TextField>)
					)}
					</div>
					<div style={styles.toolbarGroup}>
						{this.renderPeriodPicker()}
					</div>
				</Toolbar>
				<Toolbar component="nav" style={styles.toolbar}>
					<div style={styles.toolbarGroup}>
						<h1>{this._app.lang.tr(this._app.state.view)}</h1>
					</div>
					<div style={styles.toolbarGroup}>
						{this.renderKPIPicker()}
					</div>
				</Toolbar>
			</Paper>
		);
	}

	_periodFrom() {
		return this.state.period_from ? this.state.period_from.format('YYYY-MM-DD') : '';
	}
	_periodTill() {
		return this.state.period_till ? this.state.period_till.format('YYYY-MM-DD') : '';
	}
	periodRange() {
		return [this._periodFrom(), this._periodTill()];
	}

	_kpi() {
		return this.state.kpi ? this.state.kpi.key : '';
	}
	
	renderPeriodPicker() {
		return (
			<div>
				<TextField
					type="date"
					value={this._periodFrom()}
					label={this.props.app.lang.tr('from')}
					style={styles.toolbarField}
					InputLabelProps={styles.toolbarFieldLabel}
					onChange={(ev)=>{
						this.setState({period_from: moment(ev.target.value)});
					}}
				/>
				
				<TextField
					type="date"
					value={this._periodTill()}
					label={this.props.app.lang.tr('till')}
					style={styles.toolbarField}
					InputLabelProps={styles.toolbarFieldLabel}
					onChange={(ev)=>{
						this.setState({period_till: moment(ev.target.value)});
					}}
				/>
			</div>
		);
	}
	renderKPIPicker() {
		return (
			<TextField select
				label="KPI"
				value={this._kpi()}
				style={styles.toolbarField}
				InputLabelProps={styles.toolbarFieldLabel}
				onChange={(ev)=> {
					if(ev.target.value) {
						this._data.listMetrics().forEach((mx) => {
							if(mx.key == ev.target.value) {
								this.setState({kpi: mx},
									()=>this.props.onChange(this.state));
								return;
							}
						});
					}
				}}>
					{this._data.listMetrics().map((mx) => !mx.hide ? <MenuItem key={mx.key} value={mx.key}>{mx.key.toUpperCase()}</MenuItem> : '')}
			</TextField>
		)
	}

}

export default AppTools;