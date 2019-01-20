import { initUport, initBrowserProvider } from './../../../util/connectors.js';
import { browserHistory } from 'react-router';
import { initContract, contract, ROLES } from '../../../util/contracts/marketplace';
import { USER_LOGGED_IN } from '../../../util/actions';

function userLoggedIn(user) {
    return {
        type: USER_LOGGED_IN,
        payload: user,
    }
}

function redirectAfterLogin() {
    // Used a manual redirect here as opposed to a wrapper.
    // This way, once logged in a user can still access the home page.
    const currentLocation = browserHistory.getCurrentLocation();

    if ('redirect' in currentLocation.query) {
        return browserHistory.push(decodeURIComponent(currentLocation.query.redirect));
    }
    return browserHistory.push('/dashboard');
}

function getRole(dispatch, address) {
    initContract(address);
    return contract.methods.getRole().call().then(role => {
        const roleName = ROLES.getRoleName(role);
        dispatch(userLoggedIn({ address, role: { name: roleName, id: role } }));
        return redirectAfterLogin();
    });
}

function browserProviderLogin() {
    return function(dispatch) {
        return initBrowserProvider().then((web3) => {
            const getAddress = new Promise((resolve, reject) => {
                if (web3) {
                    web3.eth.getCoinbase((error, address) => {
                        if (error) {
                            console.log('Error getting the ETH address: ', error);
                            reject(error);
                        } else {
                            resolve(address.toUpperCase());
                        }
                    });
                }
            });
            return getAddress.then(getRole.bind(this, dispatch));
        });
    }
}

function uportLogin() {
  return function(dispatch) {
    const { web3 } = initUport();
    const getAddress = new Promise((resolve, reject) => {
        if (web3) {
            web3.eth.getCoinbase((error, address) => {
                if (error) {
                    console.log('Error getting the ETH address: ', error);
                    reject(error);
                } else {
                    resolve(address.toUpperCase());
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
    return getAddress.then(getRole.bind(this, dispatch));
  }
}

const LOGINS = { browserProviderLogin, uportLogin };

export function loginUser(provider) {
    return LOGINS[`${provider}Login`]();
}
