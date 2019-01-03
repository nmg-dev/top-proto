import React from 'react'
import { Toolbar, Paper, TextField, MenuItem, Divider, FormHelperText } from '@material-ui/core'

import moment from 'moment'

const styles = {
	paper: {
		margin: 'calc(min(2vh, 2vw))'
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

        let _state = {
            kpi: null,
			period_from: null,
			period_till: null,
		};
		props.data.listPredefinedCategories().forEach((c) => { _state[c] = null });
		this.state = _state;

		this._listTags = this.props.data.listTags.bind(this.props.data);

		this.props.data.addListener((ev) => {
			if(ev=='tag') {
				this.setState({ 
					kpi: props.data.defaultMetric(),
					period_from: props.data.defaultPeriodFrom(),
					period_till: props.data.defaultPeriodTill(),
				}, this.onPeriodChanged.bind(this));
			}
		});
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
		this.props.data.setCampaigns(cdata);


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
					{this.props.data.listPredefinedCategories().map((pc) => 
						(<TextField select
								name={pc}
								label={pc}
								value={this.state[pc]}
								style={styles.toolbarField}
								InputLabelProps={styles.toolbarFieldLabel}
								onChange={(ev) => {
									console.log(ev.target);
									this.setState({[ev.target.name]: ev.target.value});
								}}>
								<MenuItem key="" value={{_c: null}}> - </MenuItem>
								<Divider />
									{this._listTags(pc).map(
										(t) => (<MenuItem key={t.id} value={t}>{t.name}</MenuItem>))}
							</TextField>)
					)}
					</div>
					<div style={styles.toolbarGroup}>
						{this.renderPeriodPicker()}
					</div>
				</Toolbar>
				<Toolbar component="nav" style={styles.toolbar}>
					<div style={styles.toolbarGroup}>
						<h1>{this.props.app.state.view}</h1>
					</div>
					<div style={styles.toolbarGroup}>
						{this.renderKPIPicker()}
					</div>
				</Toolbar>
			</Paper>
		);
	}

	renderPredefinePicker(predefinedKey, titleLabel) {
		return 
	}

	_periodFrom() {
		return this.state.period_from ? this.state.period_from.format('YYYY-MM-DD') : '';
	}
	_periodTill() {
		return this.state.period_till ? this.state.period_till.format('YYYY-MM-DD') : '';
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
					label="From"
					style={styles.toolbarField}
					InputLabelProps={styles.toolbarFieldLabel}
					onChange={(ev)=>{this.setState({period_from: moment(ev.currentTarget.value)})}}
				/>
				
				<TextField
					type="date"
					value={this._periodTill()}
					label="Till"
					style={styles.toolbarField}
					InputLabelProps={styles.toolbarFieldLabel}
					onChange={(ev)=>{this.setState({period_till: moment(ev.currentTarget.value)})}}
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
						this.props.data.listMetrics().forEach((mx) => {
							if(mx.key == ev.target.value) {
								this.setState({kpi: mx});
							}
						});
					}
				}}>
					{this.props.data.listMetrics().map((mx) => !mx.hide ? <MenuItem key={mx.key} value={mx.key}>{mx.key.toUpperCase()}</MenuItem> : '')}
			</TextField>
		)
	}

}

export default AppTools;