import { contract } from '../../../util/contracts/marketplace';
import { initTx, confirmationTx } from '../../../tx/ui/expectingConfirmations/ExpectingConfirmationsActions';

export function addAdmin(targetAddress) {
    return function(dispatch) {
        contract.methods.addAdmin(targetAddress)
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
