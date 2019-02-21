import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

window.__AppCls = App;
var __app = ReactDOM.render(<App />, document.getElementById('root'));
window._onGoogleLoginSuccess = __app.onLoginCallback.bind(__app);
window._onGoogleLoginFailure = __app.onLoginFailover.bind(__app);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
