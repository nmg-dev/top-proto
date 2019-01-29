import React from 'react';

import './App.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import Config from './config';

import ModApi from './module/api';
import ModData from './module/data';
import ModLang from './module/lang';
import Metric from './module/metric';
import GTM from './module/gtm';

import Navigation from './component/navigation';
import Sidebar from './component/sidebar';

import AppScreen from './screen/appScreen';
import DashboardScreen from './screen/dashboard';
import CreativeScreen from './screen/creative';
import SimulationScreen from './screen/simulation';
import LoginScreen from './screen/login';


class App extends React.Component {
	static api = new ModApi(Config.API_HOST);
	static data = new ModData();
	static lang = new ModLang('ko');
	// static lang='ko';
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

	static renderStagedAppScreen(vk) {
        // let vk = this.state.view;
        if(!App.api.hasLogin())
            return (<LoginScreen />);
        if(!AppScreen.ViewRenders[vk]) {
            switch(vk) {
            case CreativeScreen.ACCESSOR:
                AppScreen.ViewRenders[vk] = (<CreativeScreen metric={App.kpi} period={App.period} />);
                break; 
            case SimulationScreen.ACCESSOR:
                AppScreen.ViewRenders[vk] = (<SimulationScreen metric={App.kpi} period={App.period} />);
                break;
            default:
            case DashboardScreen.ACCESSOR :
                AppScreen.ViewRenders[vk] = (<DashboardScreen metric={App.kpi} period={App.period} />);
                break;
            }
        }
        return AppScreen.ViewRenders[vk];
    }
	
	componentDidMount() {
		document.title = 'TagOperation beta by NextMediaGroup';
	}

	onDataPrepared(ev) {
		switch(ev) {
			case 'affiliation':
				this.setState({view: AppScreen.indexViewAccessor()});
			default:
				return;
		}
	}
	
	renderStagedView() {
		return App.renderStagedAppScreen(this.state.view);
	}
	
	render() {
		return (<div>
				<Navigation className="background-dark" />
				<main className="background-light wrap-container">
					<Sidebar onClickItem={this._onViewUpdate.bind(this)} />
					{this.renderStagedView()}
				</main>
			</div>); 
	}
		
	_onViewUpdate(vk) { this.setState({view: vk}); }

	_onLoginServerResponseSuccess() {
		App.api.getTags(App.data.setTags.bind(App.data));
		App.api.getCampaigns({
			from: App.period.from.format(), 
			till: App.period.till.format()
		},
		App.data.setCampaigns.bind(App.data));
	}
	_onLoginServerResponseFailure(err) {
		GTM.UserLoginError(err);
		window.alert('Login error: '+err);
	}

	onLoginCallback(gauth) {
		let resp = gauth.getAuthResponse();
		let profile = gauth.getBasicProfile();
		let gdata = {
			gid: profile.getId(),
			email: profile.getEmail(),
			token: resp.id_token,
		};
		App.api.getAuth(gdata, 
			this._onLoginServerResponseSuccess.bind(this),
			this._onLoginServerResponseFailure.bind(this));
		GTM.UserLogin(profile.getId());
	}

	onLoginFailover(ev) {
		console.error(ev);
	}
}
	
export default App;
	