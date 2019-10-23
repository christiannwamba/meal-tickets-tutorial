import React from 'react';
import ReactDOM from 'react-dom';

import { AppProvider } from '@8base/react-sdk';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import * as serviceWorker from './serviceWorker';
import { authClient } from './authClient';

import './index.css';
import './css/style.css';
import './css/font.css';

const URI = 'https://api.8base.com/cjvsrlv9k000201p3amkjgsfu';

ReactDOM.render(
  <AppProvider uri={URI} authClient={authClient} withSubscriptions>
    <Router>
      <App />
    </Router>
  </AppProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
