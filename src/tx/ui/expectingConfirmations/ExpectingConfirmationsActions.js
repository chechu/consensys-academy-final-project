export const INIT_TX = 'INIT_TX';
export function initTx(txHash) {
    return {
        type: INIT_TX,
        txHash,
    }
}

export const CONFIRMATION_TX = 'CONFIRMATION_TX';
export function confirmationTx(confirmationNumber, receipt) {
    return {
        type: CONFIRMATION_TX,
        confirmationNumber,
        receipt,
    }
}

export const CONFIRMED_TX = 'CONFIRMED_TX';
export function confirmedTx(txHash) {
    return {
        type: CONFIRMED_TX,
        txHash,
    }
}
