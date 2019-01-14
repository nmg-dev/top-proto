import React from 'react';


const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
    }
}

class Navigation extends React.Component {
    render() {
        return (<nav className="navbar bg-dark fixed-top" style={styles.navbar}>
            <a className="navbar-brand">
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