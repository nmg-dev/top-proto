import React, { Component } from 'react';
import { AppBar, Icon, IconButton, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = {
	appbar: {
	},
	toolbar: {
		display: 'flex',
		justify-contents: 'between'
	},
	toolbarGrp: {
		display: 'inline-flex',
	}
	icons: {

	}
}

class AppHeader extends Component {
	constructor(props) { 
		super(props);
		this.state = {
			user: null
		}
	}

	render() {
		return (
			<AppBar position="static" className={this.props.appbar}>
				<Toolbar className={this.props.toolbar}>
					<div className={this.props.toolbarGrp}>
						<IconButton>
							<Icon className={this.props.icons}>menu</Icon>
						</Icon>
						<Typography variant="h5">TagOperation</Typography>
					</div>
					<div className={this.props.toolbarGrp}>
					</div>
				</Toolbar>
			</AppBar>
		);
	}
}

export default withStyles(styles)(AppHeader)