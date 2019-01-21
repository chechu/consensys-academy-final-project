import { contract } from '../../../util/contracts/marketplace';
import { initTx, confirmationTx } from '../../../tx/ui/expectingConfirmations/ExpectingConfirmationsActions';
import { getWeb3, DEFAULT_GAS_LIMIT_DELETE_OPERATION } from '../../../util/connectors';
import { pullItems } from '../../../util/actions';

export async function itemRemoved(dispatch, receipt) {
    const { seller, storeId } = receipt.events.ItemRemoved.returnValues;
    dispatch(pullItems(seller, storeId, true));
}

export function removeItem(item) {
    const web3 = getWeb3();
    const removeItemParams = [
        item.storeId,
        web3.utils.toBN(item.sku),
    ];

    return function(dispatch) {
        contract.methods.removeItem(...removeItemParams)
            .send({ gas: DEFAULT_GAS_LIMIT_DELETE_OPERATION })
            .on('transactionHash', txHash => {
                dispatch(initTx(txHash));
            })
            .on('confirmation', (confirmationNumber, receipt) => {
                dispatch(confirmationTx(confirmationNumber, receipt, itemRemoved.bind(null, dispatch)));
            })
            .on('error', (error, receipt) => {
                if(!/User denied transaction signature/.test(error.message)) {
                    console.error(error, receipt);
                }
            });
    }
}
