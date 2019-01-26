import { initBrowserProvider, initUport } from './connectors';
import { initContract as initMarketplaceContract } from './contracts/marketplace';
import { initContract as initKrakenContract, subscribeToKrakenPriceTicker } from './contracts/krakenPriceTicker';

export default function enableWeb3() {
    return next => (reducer, initialState, enhancer) => {
        const store = next(reducer, initialState, enhancer);

        function enableWeb3() {
            if (!initialState || !initialState.user || !initialState.user.data) {
                return Promise.resolve()
            }

            if (initialState.user.loginMethod === 'uport') {
                return initUport().then(() => initContracts(initialState.user.data.address, store));
            }
            return initBrowserProvider().then(() => initContracts(initialState.user.data.address, store));
        }

        return {
            ...store,
            enableWeb3,
        }
    }
}

function initContracts(address, store) {
    initMarketplaceContract(address);
    subscribeToKrakenPriceTicker(address, store.dispatch);
}
