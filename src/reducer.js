import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import userReducer from './user/userReducer';
import txReducer from './tx/txReducer';
import storeReducer from './store/storeReducer';

const reducer = combineReducers({
    routing: routerReducer,
    user: userReducer,
    tx: txReducer,
    store: storeReducer,
});

export default reducer;
