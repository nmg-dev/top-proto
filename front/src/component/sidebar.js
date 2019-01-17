import React from 'react';

import DashboardScreen from '../screen/dashboard';
import CreativeScreen from '../screen/creative';
import SimulationScreen from '../screen/simulation';

const DASHBOARD_SCREEN = 'dashboard';
const CREATIVE_SCREEN = 'creative';
const SIMULATION_SCREEN = 'simulation';

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
            [SIMULATION_SCREEN]: '예상효율 확인'
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
        if(!Sidebar.ViewRenders[vk]) {
            switch(vk) {
            case CREATIVE_SCREEN:
                Sidebar.ViewRenders[vk] = (<CreativeScreen />);
                break; 
            case SIMULATION_SCREEN:
                Sidebar.ViewRenders[vk] = (<SimulationScreen />);
                break;
            default:
            case DashboardScreen.name :
                Sidebar.ViewRenders[vk] = (<DashboardScreen />);
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
        return (<div className="sidebar background-dark">
            {this.state.showSidebar ? (<div style={{minWidth: 200}}><ul style={{position: 'fixed'}}>
            <li className="sidebar-item"><img alt="sidebar logo" src="/img/logo_md.png" /></li>
                {Sidebar.ViewKeys.map((vk)=>(<li key={vk} view={vk}
                    className={'sidebar-item '+(this.state.view==vk?' active':'')}
                    onClick={this.onViewListClicked.bind(this)}>
                {Sidebar.ViewTitleOf(vk)}</li>))}
            </ul></div>) : ''}
            <div className="sidebar-holder" onClick={()=>this.setState({showSidebar: !this.state.showSidebar})}>
            <i className={'fas fa-chevron-' + (this.state.showSidebar ? 'left' : 'right')} />
            </div>
        </div>);
    }
}

export default Sidebar;
