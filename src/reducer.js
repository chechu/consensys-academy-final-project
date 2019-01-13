import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import userReducer from './user/userReducer';
import txReducer from './tx/txReducer';

const reducer = combineReducers({
    routing: routerReducer,
    user: userReducer,
    tx: txReducer,
});

export default reducer;
