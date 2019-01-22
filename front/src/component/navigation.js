import React from 'react';

import App from '../App';
import ModLang from '../module/lang';

class Navigation extends React.Component {
    constructor(ps) {
        super(ps);
        this.state = {

        };
    }

    _renderLanguageMenu() {
        console.log(App.lang.now, ModLang.Names());
        return (<li className="nav-item dropleft">
            <a data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i className="fa fa-globe" />
            </a>
            <div class="dropdown-menu">
                {ModLang.Names().map((ln)=>
                <a href="#" key={'lang-'+ln.value} lang={ln.value}
                    className={'dropdown-item ' + (ln.value==App.lang.now ? 'active' :'')}>
                    {ln.label}
                </a>)}
            </div>
        </li>);
    }

    _renderAdminMenu() {
        let pf = App.api ? App.api.userProfile() : null;
        return (<li className="nav-item dropleft">
            <a data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i className="fa fa-user" />
            </a>
            <div class="dropdown-menu">
                <a className="dropdown-item">
                {pf ?
                    <button class="btn d-flex justify-content-between align-items-center">
                        <img src={pf.icon} className="user-profile" />
                        <span className="user-name">{pf.name}</span>
                    </button> :
                    <div className="g-signin2" 
                        data-onsuccess="_onGoogleLoginSuccess"
                        data-onerror="_onGoogleLoginFailure"
                    ></div>}
                </a>
                <div className="dropdown-divider" />
                {pf && App.api.canManage() ?
                    <a className="dropdown-item">Manage</a> : ''}
                {pf && App.api.canAdmin() ?
                    <a className="dropdown-item">Admin</a> : ''}
            </div>
        </li>);
    }

    render() {
        return (<nav className="gnb navbar background-dark fixed-top">
            <a className="navbar-brand m-0 p-0">
                <img alt="main logo" src="/img/logo.png" />
            </a>
            <ul className="navbar-nav right">
                {this._renderLanguageMenu()}
                {this._renderAdminMenu()}
            </ul>
        </nav>)
    }
}

export default Navigation;