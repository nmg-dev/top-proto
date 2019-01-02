import React from 'react';
import { AppBar, Toolbar, Typography, Chip, Avatar, Button, Icon, IconButton, Menu, MenuItem, Divider, TextField, FormControl, InputLabel } from '@material-ui/core';
import moment from 'moment';

const styles = {
    logo: {},
    
	toolbarInput: {
		display: 'inline-flex',
		flexWrap: 'wrap',
	},
	actionBar: {
		display: 'flex',
		alignItems: 'baseline',
		justifyContent: 'flex-ends',
	},
	actionBarForm: {
		display: 'inline-flex',
	},
	actionBarInput: {
		display: 'inline-flex',
	}
}

class AppHead extends React.Component {
    constructor(props) {
		super(props)

		this.state = {
			openMenu: null,
			openMenuAnchor: null,
			openToolbar: true,
		};
		
		this.logoItem = React.createRef();
		this.localeMenu = React.createRef();
		this.profileMenu = React.createRef();
	}

	componentDidMount() {
		console.log('app head mount', this.state);
	}

	onMenuOpen(ev) {
		if(ev.currentTarget && ev.currentTarget.hasAttribute('menu')) {
			this.setState({
				openMenu: ev.currentTarget.getAttribute('menu'),
				openMenuAnchor: ev.currentTarget,
			});
		}
	}

	onMenuClose() {
		this.setState({openMenu: null, openMenuAnchor: null});
	}

	renderQueryToolbar() {
		if(this.state.openToolbar)
			return (
				<Toolbar style={styles.toolbar}></Toolbar>
			);
		else
			return '';
	}
	
    render() {
        return (
            <AppBar position="sticky" style={styles.appbar}>
                <Toolbar style={styles.toolbar}>
					<div style={styles.toolbarItem}>
                    	<Typography className={this.props.logo} style={styles.logo}>TAG OPERATION by NMG</Typography>
					</div>
					<div style={styles.toolbarItem}>
						{this.renderLanguageMenu()}
						{this.renderProfileMenu()}
					</div>
                </Toolbar>
				{this.renderQueryToolbar()}
            </AppBar>
        );
	}

	renderPeriodBarField(pf) {
		return (
			<TextField
				type="date"
				label={pf.label}
				InputLabelProps={{shrink:true}}
				defaultValue={pf.val}
				style={styles.actionBarInput}
			/>
		);
	} 

	renderPeriodBar() {
		return (
			<FormControl style={styles.actionBarForm}>
				<InputLabel style={styles.actionBarForm}><Icon>calendar</Icon></InputLabel>
				{this.props.periods.map(this.renderPeriodBarField)}
			</FormControl>
		);
	}

	renderCategoryBar() {
		return (
			<div style={styles.toolbarItem}>

			</div>
		)
	}

	handleLanguageMenuItemClick(ev) {
		let lang = ev.currentTarget.getAttribute('lang');
		this.props.updateLocale(lang);
		this.setState({openMenu: null});
	}
	
	renderLanguageMenu() {
		return (
			<div style={styles.toolbarItem}>
				<IconButton 
					aria-owns={this.state.openMenu=='locale'? this.localeMenu : null}
					aria-haspopup="true"
					onClick={this.onMenuOpen.bind(this)}
					menu='locale'
				>
					<Icon>language</Icon>
				</IconButton>
				<Menu
					ref={this.localeMenu}
					open={this.state.openMenu=='locale'}
					onClose={this.onMenuClose.bind(this)}
					anchorEl={this.state.openMenu=='locale' ? this.state.openMenuAnchor : null}
				>
					{this.props.languages.map((ln) => 
						<MenuItem button onClick={this.handleLanguageMenuItemClick.bind(this)} key={ln.lang} lang={ln.lang}>{ln.label}</MenuItem>
					)}
				</Menu>
			</div>
		)
	}

	handleProfileMenuItemClick(ev) {
		let nextStage = ev.target.getAttribute('stage');
		let showToolbar = 0<=['view','index'].indexOf(nextStage);
		this.props.updateStage(nextStage);


		this.setState({
			openMenu: null,
			openToolbar: showToolbar,
		});
	}

	renderProfileMenuItem(condition, stage) {
		if(condition) {
			return (
				<MenuItem onClick={this.handleProfileMenuItemClick.bind(this)} 
				stage={stage}>
					{stage}
				</MenuItem>
			);
		} else {
			return ''
		}
	}

    renderProfileMenu() {
		return (
			<div style={styles.toolbarItem}>
				<IconButton
					aria-haspopup="true"
					aria-owns={this.state.openMenu == 'profile' ? this.profileMenu : null}
					onClick={this.onMenuOpen.bind(this)}
					menu='profile'
				>
					<Icon>person</Icon>
				</IconButton>
				<Menu 
					ref={this.profileMenu}
					open={this.state.openMenu=='profile'}
					onClose={this.onMenuClose.bind(this)}
					anchorEl={this.state.openMenu=='profile'? this.state.openMenuAnchor : null}
				>
					<MenuItem>
						<Chip
							title={this.props.user.profile.email}
							avatar={<Avatar alt={this.props.user.profile.email} 
							src={this.props.user.profile.picture} />}
							label={this.props.user.profile.name}
							onClick={this.handleProfileClick}
						/>
					</MenuItem>
					<Divider />
					{this.renderProfileMenuItem(true, 'index')}
					{this.renderProfileMenuItem(true, 'view')}
					{this.renderProfileMenuItem(this.props.user.can_manage, 'manage')}
					{this.renderProfileMenuItem(this.props.user.can_admin, 'admin')}
				</Menu>
			</div>
		);
	}
}

AppHead.defaultProps = {
	languages: [
		{lang: 'en', label: 'English'},
		{lang: 'ko', label: '한국어'}
	],
	periods: [
		{val: moment('-1 years').format('YYYY-MM-DD'), label: 'from'},
		{val: moment('now').format('YYYY-MM-DD'), label: 'till'}
	],
	momentFormat: 'YYYY-MM-DD'
}

export default AppHead;