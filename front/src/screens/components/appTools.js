import React from 'react'
import { Toolbar, Paper, TextField, MenuItem, Divider } from '@material-ui/core'

import moment from 'moment'

const styles = {};


class AppTools extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            kpi: props.metrix[0],
			period_from: moment().add(-1, 'year'),
			period_till: moment(),
        };
    }

    componentDidMount() {
        this.props.loadCampaigns({
            from: this.state.period_from.toDate(),
            till: this.state.period_till.toDate(),
        });
    }

    /* render query toolbar */
	render() {
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
						this.props.metrix.forEach((mx) => {
							if(mx.key == ev.target.value) {
								this.resetPerformances();
								this.procScoreMap(mx, {kpi: mx});
							}
						});
					}
				}}>
					{this.props.metrix.map((mx) => !mx.hide ? <MenuItem key={mx.key} value={mx.key}>{mx.key.toUpperCase()}</MenuItem> : '')}
			</TextField>
		)
	}

}

export default AppTools;