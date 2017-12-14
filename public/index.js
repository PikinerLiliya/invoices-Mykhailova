import React from 'react';
import { render } from 'react-dom';
import { Route, Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import Store from './js/lib/store';
import Main from './js/components/Main'

const { store, history } = Store();

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Main} />
    </Router>
  </Provider>,
  document.getElementById('container')
);