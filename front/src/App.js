import React from 'react';
import './App.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import ApplicationContext from './AppContext';
import Navigation from './component/navigation';
import Sidebar from './component/sidebar';
import ModApi from './module/api';
import ModData from './module/data';
import Config from './config';
import moment from 'moment';
import Metric from './module/metric';

class App extends React.Component {
	static api = new ModApi(Config.API_HOST);
	static data = new ModData();
	static lang='ko';
	static period = {
		from: moment().add(-1, 'years'),
		till: moment()
	};
	static kpi = Metric.DefaultKey();

	static Current() {
		return App._current;
	}

	constructor(ps) {
		super(ps);
		this.state = {
			view: '',
		}
		App._current = this;
		App.data.addListener(this.onDataPrepared.bind(this));
	}
	
	componentDidMount() {
		document.title = 'TagOperation beta by NextMediaGroup';
	}

	onDataPrepared(ev) {
		switch(ev) {
			case 'affiliation':
				this.setState({view: Sidebar.indexViewAccessor()});
		}
	}
	
	renderStagedView() {
		return Sidebar.renderStagedAppScreen(this.state.view);
	}
	
	render() {
		return (<ApplicationContext.Provider>
			<div>
				<Navigation className="background-dark" />
				<main className="background-light wrap-container">
					<Sidebar onClickItem={this._onViewUpdate.bind(this)} />
					{this.renderStagedView()}
				</main>
			</div>
		</ApplicationContext.Provider>); 
	}
		
	_onViewUpdate(vk) { this.setState({view: vk}); }

	_onLoginServerResponseSuccess(resp) {
		// App.api.getTags(App.data.setTags.bind(App.data));
		// App.api.getCampaigns({
		// 	from: App.period.from.format(), 
		// 	till: App.period.till.format()
		// 	},
		// 	App.data.setCampaigns.bind(App.data));
	}
	_onLoginServerResponseFailure(err) {
		// this.setState({view: Sidebar.indexViewAccessor()});
		// window.alert('Login failed!');
	}

	onLoginCallback(gauth) {
		this.setState({view: Sidebar.indexViewAccessor()});
		// let resp = gauth.getAuthResponse();
		// let profile = gauth.getBasicProfile();
		// let gdata = {
		// 	gid: profile.getId(),
		// 	email: profile.getEmail(),
		// 	token: resp.id_token,
		// };
		// App.api.getAuth(gdata, 
		// 	this._onLoginServerResponseSuccess.bind(this),
		// 	this._onLoginServerResponseFailure.bind(this));
	}

	onLoginFailover(ev) {
		console.error(ev);
	}
}
	
export default App;
	