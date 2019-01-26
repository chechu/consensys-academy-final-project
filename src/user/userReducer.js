import {
    USER_BALANCE_UPDATED,
    USER_LOGGED_IN,
    USER_LOGGED_OUT,
    USER_PENDING_FUNDS_UPDATED,
    IS_EMERGENCY_UPDATED,
    LOGIN_METHOD_USED,
} from '../util/actions';

const initialState = {
    data: null,
    balance: null,
    pendingFunds: null,
    isEmergency: null,
    loginMethod: null,
};

const userReducer = (state = initialState, action) => {
    if (action.type === USER_LOGGED_IN) {
        return Object.assign({}, state, {
            data: action.payload,
        });
    }

    if (action.type === USER_LOGGED_OUT) {
        return Object.assign({}, state, initialState);
    }

    if (action.type === USER_BALANCE_UPDATED) {
        return Object.assign({}, state, {
            balance: action.newBalance,
        });
    }

    if (action.type === USER_PENDING_FUNDS_UPDATED) {
        return Object.assign({}, state, {
            pendingFunds: action.pendingFunds,
        });
    }

    if (action.type === IS_EMERGENCY_UPDATED) {
        return Object.assign({}, state, {
            isEmergency: action.isEmergency,
        });
    }

    if (action.type === LOGIN_METHOD_USED) {
        return Object.assign({}, state, {
            loginMethod: action.method,
        });
    }

    return state;
}

export default userReducer;
