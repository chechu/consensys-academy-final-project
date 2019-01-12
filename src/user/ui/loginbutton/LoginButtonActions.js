import { initUport, initBrowserProvider } from './../../../util/connectors.js'
import { browserHistory } from 'react-router'

export const USER_LOGGED_IN = 'USER_LOGGED_IN'
function userLoggedIn(user) {
  return {
    type: USER_LOGGED_IN,
    payload: user
  }
}

function redirectAfterLogin() {
    // Used a manual redirect here as opposed to a wrapper.
    // This way, once logged in a user can still access the home page.
    const currentLocation = browserHistory.getCurrentLocation()

    if ('redirect' in currentLocation.query) {
        return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
    }
    return browserHistory.push('/dashboard')
}

function browserProviderLogin() {
    return function(dispatch) {
        return initBrowserProvider().then((web3) => {
            return new Promise((resolve) => {
                if (web3) {
                    web3.eth.getCoinbase((error, address) => {
                        if (error) {
                            console.log('Error getting the ETH address: ', error);
                        } else {
                            dispatch(userLoggedIn({ address }));
                            resolve(redirectAfterLogin());
                        }
                    });
                }
            });
        });
    }
}

function uportLogin() {
  return function(dispatch) {
    const { web3, uport } = initUport();
    return new Promise((resolve) => {
        if (web3) {
            web3.eth.getCoinbase((error, address) => {
                if (error) {
                    console.log('Error getting the ETH address: ', error);
                } else {
                    dispatch(userLoggedIn({ address, did: uport.did }));
                    resolve(redirectAfterLogin());
                }
                /*
                uport.requestDisclosure({requested: ['name', 'country', 'image', 'avatar'], notifications: true, verified: ['Jesus Marketplace info']});
                uport.onResponse('disclosureReq').then(res => {
                    console.log({res})
                    dispatch(userLoggedIn({ ...res.payload, address, did: uport.did }));
                });
                */
            });
        }
    });
  }
}

const LOGINS = { browserProviderLogin, uportLogin };

export function loginUser(provider) {
    return LOGINS[`${provider}Login`]();
}
