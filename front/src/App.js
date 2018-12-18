import React from 'react';

import AppLogin from './screens/appLogin.js';
import AppCommon from './screens/appCommon.js';

import AppConfig from './config.js';

const styles = {
	
	
	appbarIcons: {},
	
}

class App extends React.Component {
	constructor(props) {
		super(props);
	
		this.state = {
			user: null,
			lang: 'en',
		}
		this.classes = props
		window.__app = this;

		this.view = React.createRef();
	}

	updateLocale(nextLocale) {
		this.setState({lang: nextLocale});
	}

	componentDidMount() {
		console.log(AppConfig);
	}

	componentWillUpdate() {
		// on login
		if(this.state.login!=null) {
			// this._appHead.setState({login: this.state.login});
			console.log(this.__head.current, this.state.login);
			this.__head.current.setState({
				login: this.state.login
			});
			this.state.user = this.state.login;
		}
	}

	componentDidUpdate() {
		// console.log(this, this.state);
		// console.log(arguments);
	}

	promised_request(endpoint, options) {
		return fetch(AppConfig.API_HOST + endpoint, options)
			.catch((err) => { console.error(err); })
			.then((plainResp) => plainResp.json())
	}


	sessionLogin(gauth) {
		let resp = gauth.getAuthResponse();
		let profile = gauth.getBasicProfile();
		this.promised_request('/auth', {
			method: 'POST',
			body: JSON.stringify({
				id: profile.getId(),
				email: profile.getEmail(),
				token: resp.id_token
			})
		})
			.then((userInfo) => {
				this.setState({user: userInfo});
			});
	}





	render() {
		// not logged in yet
		if(!this.state.user) {
			return (
				<AppLogin updateLocale={this.updateLocale.bind(this)} />
			);
		} else {
			return (
				<AppCommon 
					ref={this.view} 
					user={this.state.user} 
					lang={this.state.lang}
					api={this.promised_request.bind(this)}
					updateLocale={this.updateLocale.bind(this)} />
			);
		}
	}
}
export default App;
