import produce from 'immer';
import { USER_LOGGED_OUT, PULL_STORES, PULL_STORE, PULL_ITEMS } from '../util/actions';

const initialState = {
    storesBySeller: { }, // A map with sellerAddress: { stores: [StoreMetadata] }
};

const storeReducer = (state = initialState, action) => {
    if (action.type === PULL_STORES) {
        return pullStoresMetadata(state, action.newStoresMetadata);
    }

    if (action.type === PULL_STORE) {
        return pullStoreMetadata(state, action.sellerAddress, action.store);
    }

    if (action.type === PULL_ITEMS) {
        return pullItems(state, action.store, action.items);
    }

    if (action.type === USER_LOGGED_OUT) {
        return Object.assign({}, state, initialState);
    }

    return state
}

function pullItems(state, store, items) {
    return produce(state, (draftState) => {
        const storeToUpdate = draftState.storesBySeller[store.sellerAddress].stores.find(it => it.storeId === store.storeId);
        storeToUpdate.items = items;
    });
}

function pullStoreMetadata(state, sellerAddress, store) {
    sellerAddress = sellerAddress.toUpperCase();
    return produce(state, (draftState) => {
        let storeIndex;
        if (!state.storesBySeller[sellerAddress]) {
            draftState.storesBySeller[sellerAddress] = { stores: [] };
            storeIndex = -1;
        } else {
            storeIndex = state.storesBySeller[sellerAddress].stores.findIndex(st => st.storeId === store.storeId);
        }

        if (storeIndex !== -1) {
            Object.keys(store).forEach(storeKey =>
                draftState.storesBySeller[sellerAddress].stores[storeIndex][storeKey] = store[storeKey]
            );
        } else {
            draftState.storesBySeller[sellerAddress].stores.push(store);
        }
    });
}

function pullStoresMetadata(state, newStoresMetadata) {
    return produce(state, (draftState) => {
        newStoresMetadata.forEach((tuple) => {
            draftState.storesBySeller[tuple.sellerAddress] = { stores: [] };
            tuple.stores.forEach(it => draftState.storesBySeller[tuple.sellerAddress].stores.push(it));
        });
    });
}

export default storeReducer
