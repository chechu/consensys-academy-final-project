import { contract } from '../../../util/contracts/marketplace';
import { initTx, confirmationTx } from '../../../tx/ui/expectingConfirmations/ExpectingConfirmationsActions';
import { resolveAddress } from '../../../util/ens';

export function addSeller(targetAddress, ensEnabled) {
    return function(dispatch) {
        resolveAddress(targetAddress, ensEnabled)
            .then(realAddres => {
                console.log('Address resolved:', { realAddres, targetAddress });
                contract.methods.addSeller(realAddres)
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
            });
    }
}
