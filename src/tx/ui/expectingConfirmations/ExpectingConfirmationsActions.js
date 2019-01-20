import { INIT_TX, CONFIRMATION_TX, CONFIRMED_TX } from '../../../util/actions';
import { CONFIRMATIONS_THRESHOLD } from './ExpectingConfirmations';

export function initTx(txHash) {
    return {
        type: INIT_TX,
        txHash,
    }
}

export function confirmationTx(confirmationNumber, receipt, onThresholdConfirmation) {
    return function (dispatch, getState) {
        if (getState().tx.pendingTx[receipt.transactionHash]) {
            confirmationNumber = (confirmationNumber !== undefined) ? confirmationNumber + 1 : undefined; // The first one is 0

            const expectedConfirmations = confirmationNumber ? (CONFIRMATIONS_THRESHOLD - confirmationNumber) : CONFIRMATIONS_THRESHOLD;

            if (!expectedConfirmations) {
                onThresholdConfirmation(receipt);
            }

            dispatch({
                type: CONFIRMATION_TX,
                expectedConfirmations,
                confirmationNumber,
                receipt,
            });
        }
    }
}

export function confirmedTx(txHash) {
    return {
        type: CONFIRMED_TX,
        txHash,
    }
}
