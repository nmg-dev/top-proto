import React from 'react';
import AppScreen from './appScreen';

class LoginScreen extends AppScreen {
    constructor(ps) {
        super(ps);
        this.state = {};
    }

    renderQueryTopControls() { return [] }
    renderQueryMidControls() { return '' }
    renderQueryBottomControls() { return '' }

    renderContent() {
        return (<div className="section panel-details">
            <div className="row section-title">
                <div className="col">
                </div>
            </div>
            <div className="row">
                <div className="col d-flex justify-content-center align-items-center"
                    style={{height: '50vh'}}>
                    <div className="g-signin2" 
                        data-onsuccess="_onGoogleLoginSuccess"
                        data-onerror="_onGoogleLoginFailure"
                    ></div>
                </div>
            </div>
            <div className="row">
                <div className="col d-flex justify-content-end align-items-baseline">
                    <h7>by <a href="https://www.nextmediagroup.co.kr" target="_blank">NextMediaGroup</a></h7>
                </div>
            </div>
        </div>);
    }
}

export default LoginScreen;