import { contract } from '../../../util/contracts/marketplace';
import { initTx, confirmationTx } from '../../../tx/ui/expectingConfirmations/ExpectingConfirmationsActions';
import { getWeb3, DEFAULT_GAS_LIMIT_WITHDRAW_OPERATION } from '../../../util/connectors';
import { USER_PENDING_FUNDS_UPDATED, USER_BALANCE_UPDATED } from '../../../util/actions';

export async function fundsCollected(dispatch, sellerAddress, receipt) {
    const pendingFunds = await contract.methods.getPendingFunds().call();
    dispatch({ type: USER_PENDING_FUNDS_UPDATED, pendingFunds });

    const newBalance = await getWeb3().eth.getBalance(sellerAddress);
    dispatch({ type: USER_BALANCE_UPDATED, newBalance });
}

export function withdrawFunds(sellerAddress) {
    const addItemsParams = [];
    return function(dispatch) {
        contract.methods.withdraw(...addItemsParams)
            .send({ gas: DEFAULT_GAS_LIMIT_WITHDRAW_OPERATION })
            .on('transactionHash', txHash => {
                dispatch(initTx(txHash));
            })
            .on('confirmation', (confirmationNumber, receipt) => {
                dispatch(confirmationTx(confirmationNumber, receipt, fundsCollected.bind(null, dispatch, sellerAddress)));
            })
            .on('error', (error, receipt) => {
                if(!/User denied transaction signature/.test(error.message)) {
                    console.error(error, receipt);
                }
            });
    }
}
