import { PULL_STORE } from '../../../util/actions';
import * as contract from '../../../util/contracts/marketplace';

export function pullStore(sellerAddress, storeId) {
    return function(dispatch, getState) {
        const newStoresMetadata = getState().store.storesBySeller[sellerAddress]
            && getState().store.storesBySeller[sellerAddress].stores.find(it => it.storeId === storeId);

        if (!newStoresMetadata) {
            contract.getStoreMetadata(sellerAddress, storeId)
                .then(store => dispatch({
                    type: PULL_STORE,
                    sellerAddress,
                    store,
                }));
        }
    }
}
