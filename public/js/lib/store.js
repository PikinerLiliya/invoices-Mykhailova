import { createBrowserHistory } from 'history';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import reducers from '../reducers';

export default () => {
  const history = createBrowserHistory();
  const extendedReducers = Object.assign({}, reducers, {
    router: routerReducer
  });

  const store = createStore(
    combineReducers(extendedReducers),
    applyMiddleware(
      thunkMiddleware.withExtraArgument(history),
      routerMiddleware(history)
    )
  );

  window.store = store;

  return {
    history,
    store
  }
}