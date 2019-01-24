import { contract } from '../../../util/contracts/marketplace';
import { initTx, confirmationTx } from '../../../tx/ui/expectingConfirmations/ExpectingConfirmationsActions';
import { IS_EMERGENCY_UPDATED } from '../../../util/actions';

export async function emergencyToggled(dispatch, receipt) {
    contract.methods.stopped().call()
        .then(isEmergency => dispatch({ type: IS_EMERGENCY_UPDATED, isEmergency }));
}

export function toggleEmergency(itemProps, pullAction) {
    return function(dispatch) {
        contract.methods.toggleContractActive()
            .send()
            .on('transactionHash', txHash => {
                dispatch(initTx(txHash));
            })
            .on('confirmation', (confirmationNumber, receipt) => {
                dispatch(confirmationTx(confirmationNumber, receipt, emergencyToggled.bind(null, dispatch)));
            })
            .on('error', (error, receipt) => {
                if(!/User denied transaction signature/.test(error.message)) {
                    console.error(error, receipt);
                }
            });
    }
}
