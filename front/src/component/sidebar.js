
import React from 'react';
import AppScreen from '../screen/appScreen';

import './sidebar.css';


class Sidebar extends React.Component {

    constructor(ps) {
        super(ps);

        this.state = {
            view: AppScreen.indexViewAccessor(),
            showSidebar: 1024 < window.innerWidth
        }

    }

    onViewListClicked(ev) {
        let vk = ev.target.getAttribute('view');
        if(vk && vk!==this.state.view) {
            this.setState({view: vk}, ()=>this.props.onClickItem(vk));
        }
    }

    render() {
        return (<div className="sidebar background-dark m-0 p-0">
            {this.state.showSidebar ? (<div className="sidebar-inner">
            <ul>
                <li className="sidebar-item logo m-0 p-0">
                    <img alt="logo" className="logo" src="/img/logo_md.png" />
                </li>
                {AppScreen.ViewKeys.map((vk)=>(<li key={vk} view={vk}
                    className={'sidebar-item '+(this.state.view===vk?' active':'')}
                    onClick={this.onViewListClicked.bind(this)}>
                {AppScreen.ViewTitleOf(vk)}</li>))}
            </ul></div>) : ''}
            <div className="sidebar-holder m-0 p-1" onClick={()=>this.setState({showSidebar: !this.state.showSidebar})}>
            <i className={'fas fa-chevron-' + (this.state.showSidebar ? 'left' : 'right')} />
            </div>
        </div>);
    }
}

export default Sidebar;
