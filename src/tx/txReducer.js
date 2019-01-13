import produce from 'immer';
import { CONFIRMATIONS_THRESHOLD } from './ui/expectingConfirmations/ExpectingConfirmations';

const initialState = {
    pendingTx: {}, // Map with pending transactions info
    confirmedTx: [], // List of tx hashes with the required number of confirmations
}

const txReducer = (state = initialState, action) => {
    if (action.type === 'INIT_TX') {
        return produce(state, draftState => {
            draftState.pendingTx[action.txHash] = {
                expectedConfirmations: CONFIRMATIONS_THRESHOLD,
            };
        });
    }

    if (action.type === 'CONFIRMATION_TX') {
        if (state.pendingTx[action.receipt.transactionHash]) {
            let confirmationNumber = (action.confirmationNumber !== undefined) ? action.confirmationNumber + 1 : undefined; // The first one is 0
            const expectedConfirmations = confirmationNumber ? (CONFIRMATIONS_THRESHOLD - confirmationNumber) : CONFIRMATIONS_THRESHOLD;
            return produce(state, draftState => {
                if(expectedConfirmations) {
                    // There are confirmations to expect yet
                    draftState.pendingTx[action.receipt.transactionHash].confirmationNumber = action.confirmationNumber;
                    draftState.pendingTx[action.receipt.transactionHash].expectedConfirmations = expectedConfirmations;
                } else {
                    // There aren't any confirmations to wait for...
                    delete draftState.pendingTx[action.receipt.transactionHash];
                    draftState.confirmedTx.push(action.receipt.transactionHash);
                }
            });
        }
    }

    return state
}

export default txReducer
