import { USER_BALANCE_UPDATED, USER_LOGGED_IN, USER_LOGGED_OUT } from '../util/actions';

const initialState = {
    data: null,
    balance: null,
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

    return state;
}

export default userReducer;
