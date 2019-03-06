import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import "admin-lte/dist/css/AdminLTE.min.css";
import "admin-lte/dist/css/skins/_all-skins.css";
import "font-awesome/css/font-awesome.min.css";
import "ionicons/dist/css/ionicons.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
