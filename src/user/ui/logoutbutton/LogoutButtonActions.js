import { browserHistory } from 'react-router'
import { USER_LOGGED_OUT } from '../../../util/actions';

function userLoggedOut(user) {
    return {
        type: USER_LOGGED_OUT,
        payload: user
    }
}

export function logoutUser() {
    return function(dispatch) {
        // Logout user.
        dispatch(userLoggedOut())

        // Redirect home.
        return browserHistory.push('/')
    }
}
