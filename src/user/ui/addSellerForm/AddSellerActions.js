import { contract } from '../../../util/contracts/marketplace';
import { initTx, confirmationTx } from '../../../tx/ui/expectingConfirmations/ExpectingConfirmationsActions';

export function addSeller(targetAddress) {
    return function(dispatch) {
        contract.methods.addSeller(targetAddress)
            .send()
            .on('transactionHash', txHash => {
                dispatch(initTx(txHash));
            })
            .on('confirmation', (confirmationNumber, receipt) => {
                dispatch(confirmationTx(confirmationNumber, receipt));
            })
            .on('error', (error, receipt) => {
                if(!/User denied transaction signature/.test(error.message)) {
                    console.error(error, receipt);
                }
            });
    }
}
