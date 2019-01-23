import { USER_BALANCE_UPDATED, USER_LOGGED_IN, USER_LOGGED_OUT, USER_PENDING_FUNDS_UPDATED } from '../util/actions';

const initialState = {
    data: null,
    balance: null,
    pendingFunds: null,
};

const userReducer = (state = initialState, action) => {
    if (action.type === USER_LOGGED_IN) {
        return Object.assign({}, state, {
            data: action.payload,
        });
    }

    if (action.type === USER_LOGGED_OUT) {
        return Object.assign({}, state, {
            data: null,
        });
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

    return state;
}

export default userReducer;
