import React from 'react';
import { IconButton, Icon, Menu, MenuItem } from '@material-ui/core';

const menuLocale = '_menu_locale';

const styles = {};

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
			onClose={()=>{this.setState({show: false, anchor: null})}}
			anchorEl={this.state.anchor}>
			{languages.map((ln) => 
				<MenuItem button onClick={(ev)=>{this.setState({lang: ev.target.getAttribute('lang')})}} key={ln} lang={ln}>{ln.label}</MenuItem>
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