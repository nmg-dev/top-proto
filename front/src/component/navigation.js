import React from 'react';

class Navigation extends React.Component {
    render() {
        return (<nav className="gnb navbar background-dark fixed-top">
            <a className="navbar-brand m-0 p-0">
                <img alt="main logo" src="/img/logo.png" />
            </a>
            <ul className="navbar-nav right">
                <li><i className="fa fa-globe" /></li>
                <li><i className="fa fa-user" /></li>
            </ul>
        </nav>)
    }
}

export default Navigation;