import React from 'react';
import CardPanel from '../component/cardpanel';

class AppScreen extends React.Component {
    constructor(ps) {
        super(ps);
    }

    renderHeaderbar() {
        return (<div className="col">
            <img src="/img/logo_lg.png" alt="logo-large" />
        </div>);    
    }

    // abstract
    renderContent() { return ''; }

    render() {
        return (<div className="container-flex panel-wrapper">
                <div className="row">
                    {this.renderHeaderbar()}
                </div>
                <div className="row">
                    <CardPanel body={this.renderContent()} />
                </div>
            </div>
        );
    }
}

export default AppScreen;