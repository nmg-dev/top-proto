import React from 'react';

import DashboardScreen from '../screen/dashboard';
import CreativeScreen from '../screen/creative';
import SimulationScreen from '../screen/simulation';
import LoginScreen from '../screen/login';
import App from '../App';

const LOGIN_SCREEN = 'login';
const DASHBOARD_SCREEN = 'dashboard';
const CREATIVE_SCREEN = 'creative';
const SIMULATION_SCREEN = 'simulation';

const MANAGE_DATA = 'manage-data';
const MANAGE_TAGS = 'manage-tag';
const MANAGE_CMPS = 'manage-campaign';
const MANAGE_USER = 'admin-user';

class Sidebar extends React.Component {
    static ViewKeys = [
        DASHBOARD_SCREEN,
        CREATIVE_SCREEN,
        SIMULATION_SCREEN,
    ];

    static ViewTitles = {
        ko: {
            [DASHBOARD_SCREEN]: '업종별 분석',
            [CREATIVE_SCREEN]: '크리에이티브 분석',
            [SIMULATION_SCREEN]: '예상효율 확인',

            [MANAGE_DATA]: '데이터 입력',
            [MANAGE_TAGS]: '태그 관리',
            [MANAGE_CMPS]: '캠페인 관리',
            [MANAGE_USER]: '사용자 관리',
        },
        en: {
            [DASHBOARD_SCREEN]: 'by Industries',
            [CREATIVE_SCREEN]: 'by Creatives',
            [SIMULATION_SCREEN]: 'Simulation',

            [MANAGE_DATA]: 'Push Data',
            [MANAGE_TAGS]: 'Manage Tags',
            [MANAGE_CMPS]: 'Manage Campaigns',
            [MANAGE_USER]: 'Manage Users',
        }
    };

    static ViewRenders = {};

    static indexViewAccessor() {
        return DASHBOARD_SCREEN;
    }

    static ViewTitleOf(vk) {
        let locale='ko';
        return Sidebar.ViewTitles[locale][vk];
    }

    static renderStagedAppScreen(vk) {
        // let vk = this.state.view;
        if(!App.api.hasLogin())
            return (<LoginScreen metric={App.kpi} period={App.period} />);
        if(!Sidebar.ViewRenders[vk]) {
            switch(vk) {
            case CREATIVE_SCREEN:
                Sidebar.ViewRenders[vk] = (<CreativeScreen metric={App.kpi} period={App.period} />);
                break; 
            case SIMULATION_SCREEN:
                Sidebar.ViewRenders[vk] = (<SimulationScreen metric={App.kpi} period={App.period} />);
                break;
            default:
            case DashboardScreen.name :
                Sidebar.ViewRenders[vk] = (<DashboardScreen metric={App.kpi} period={App.period} />);
                break;
            }
        }
        return Sidebar.ViewRenders[vk];
    }

    constructor(ps) {
        super(ps);

        this.state = {
            view: Sidebar.indexViewAccessor(),
            showSidebar: 1024 < window.innerWidth
        }

    }

    onViewListClicked(ev) {
        let vk = ev.target.getAttribute('view');
        if(vk && vk!=this.state.view) {
            this.setState({view: vk}, ()=>this.props.onClickItem(vk));
        }
    }

    render() {
        return (<div className="sidebar background-dark m-0 p-0">
            {this.state.showSidebar ? (<div className="sidebar-inner"><ul>
            <li className="sidebar-item.logo"><img alt="sidebar logo" src="/img/logo_md.png" /></li>
                {Sidebar.ViewKeys.map((vk)=>(<li key={vk} view={vk}
                    className={'sidebar-item '+(this.state.view==vk?' active':'')}
                    onClick={this.onViewListClicked.bind(this)}>
                {Sidebar.ViewTitleOf(vk)}</li>))}
            </ul></div>) : ''}
            <div className="sidebar-holder m-0 p-2" onClick={()=>this.setState({showSidebar: !this.state.showSidebar})}>
            <i className={'fas fa-chevron-' + (this.state.showSidebar ? 'left' : 'right')} />
            </div>
        </div>);
    }
}

export default Sidebar;
