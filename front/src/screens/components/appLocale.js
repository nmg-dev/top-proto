import React from 'react';
import { IconButton, Icon, Menu, MenuItem } from '@material-ui/core';

const menuLocale = '_menu_locale';

// const styles = {};

const languages = [
    {key: 'ko', label: '한국어'},
    {key: 'en', label: 'English'},
];

class AppLocale extends React.Component {
    constructor(props)  {
        super(props);

        this.state = {
            show: false,
            anchor: null,
            lang: languages[0]
        }
	}
	
	_onClose() { this.setState({show: false, anchor: null}); }
	_onSelect(ev) { 
		let lcode = ev.target.getAttribute('lang');
		let lang = languages.filter((v) => v.key==lcode).pop();
		if(lang) {
			// TODO: update forward
			this.props.app.updateLocale(lcode);
			this.setState({lang: lang, show: false});
		}
	}
    getLocale() { return this.state.lang; }
	setLocale(ln) { this.setState({lang: ln})}
	lang() {
		// TODO: build with keys
	}
	updateLocale(nextLocale) {
		this.setState({lang: nextLocale});
	}
	renderLanguageButton() {
		return (
			<IconButton 
				aria-owns={menuLocale}
				aria-haspopup="true"
				onClick={(ev) => { this.setState({show: true, anchor: ev.target })}}>
				<Icon>language</Icon>
			</IconButton>);
	}
	renderLanguageButtonMenu() {
		return (<Menu 
			open={this.state.show}
			onClose={this._onClose.bind(this)}
			anchorEl={this.state.anchor}>
			{languages.map((ln) => 
				<MenuItem button onClick={this._onSelect.bind(this)} key={ln.key} lang={ln.key}>{ln.label}</MenuItem>
			)}
		</Menu>);
	}


    render() {
		return (<span>
			{this.renderLanguageButton()}
			{this.renderLanguageButtonMenu()}
		</span>)
    }
}

export default AppLocale;