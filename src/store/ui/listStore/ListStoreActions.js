import { PULL_STORES } from '../../../util/actions';
import * as contract from '../../../util/contracts/marketplace';

export function pullStores(sellerAddresses) {
    return function(dispatch, getState) {
        Promise.all(sellerAddresses
            .filter(sellerAddress => !getState().storesBySeller || !getState().storesBySeller[sellerAddress])
            .map(async sellerAddress => ({ sellerAddress, stores: await contract.getStoresMetadataBySeller(sellerAddress) }))
        ).then(newStoresMetadata => dispatch({ type: PULL_STORES, newStoresMetadata }));
    }
}
