import { browserHistory } from 'react-router';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import reducer from './reducer';
import persistState from 'redux-localstorage';
import enableWeb3 from './util/web3EnableMiddleware';

// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const routingMiddleware = routerMiddleware(browserHistory)

const enhancer = composeEnhancers(
    applyMiddleware(
        thunkMiddleware,
        routingMiddleware
    ),
    persistState(),
    enableWeb3(),
)

const store = createStore(reducer, enhancer);

export default store
