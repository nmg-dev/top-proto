import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

var __app = ReactDOM.render(<App />, document.getElementById('root'));

window._onGoogleLoginSuccess = __app.sessionLogin.bind(__app);

window._onGoogleLoginFailure = function(err) {
	console.error(err.error);
	__app.setState({login: false});
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
