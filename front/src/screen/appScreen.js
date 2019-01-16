import React from 'react';
import CardPanel from '../component/cardpanel';




class AppScreen extends React.Component {
    static views = {};

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
        return (
            <div className="container-fluid panel-wrapper">
                <div className="row">
                    {this.renderHeaderbar()}
                </div>
                <div className="row">
                    <div className="col">
                        <CardPanel body={this.renderContent()} />
                    </div>
                </div>
            </div>
        );
    }
}

export default AppScreen;