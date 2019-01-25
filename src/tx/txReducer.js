import produce from 'immer';
import { CONFIRMATIONS_THRESHOLD } from './ui/expectingConfirmations/ExpectingConfirmations';
import { INIT_TX, CONFIRMATION_TX, ETH_PRICE_UPDATED, NETWORK_VERSION_UPDATED } from '../util/actions';

const initialState = {
    pendingTx: {}, // Map with pending transactions info
    confirmedTx: [], // List of tx hashes with the required number of confirmations
    ETHPriceInUSD: null,
    ensEnabled: false,
}

const ENS_SUPPORTED_NETWORK_VERSIONS = [
    1, // Mainnet
    3, // Ropsten
    4, // Rinkeby
];

const txReducer = (state = initialState, action) => {
    if (action.type === INIT_TX) {
        return produce(state, draftState => {
            draftState.pendingTx[action.txHash] = {
                expectedConfirmations: CONFIRMATIONS_THRESHOLD,
            };
        });
    }

    if (action.type === CONFIRMATION_TX) {
        return produce(state, (draftState) => {
            if(action.expectedConfirmations) {
                // There are confirmations to expect yet
                draftState.pendingTx[action.receipt.transactionHash].confirmationNumber = action.confirmationNumber;
                draftState.pendingTx[action.receipt.transactionHash].expectedConfirmations = action.expectedConfirmations;
            } else {
                // There aren't any confirmations to wait for...
                delete draftState.pendingTx[action.receipt.transactionHash];
                draftState.confirmedTx.push(action.receipt.transactionHash);
            }
        });
    }

    if (action.type === ETH_PRICE_UPDATED) {
        console.log(`Changing the ETH_PRICE_UPDATED to [${action.price}]. Data provided by Kraken via Oraclize`);
        return produce(state, (draftState) => {
            draftState.ETHPriceInUSD = action.price;
        });
    }

    if (action.type === NETWORK_VERSION_UPDATED) {
        return produce(state, (draftState) => {
            draftState.ensEnabled = ENS_SUPPORTED_NETWORK_VERSIONS.includes(action.version);
        });
    }

    return state
}

export default txReducer
