import { contract } from '../../../util/contracts/marketplace';
import { initTx, confirmationTx } from '../../../tx/ui/expectingConfirmations/ExpectingConfirmationsActions';
import { getWeb3 } from '../../../util/connectors';
import { pullStore } from '../../../util/actions';

export async function itemAdded(dispatch, receipt) {
    const { seller, storeId } = receipt.events.ItemCreated.returnValues;
    dispatch(pullStore(seller, storeId, true));
}

export function addItem(itemProps) {
    const web3 = getWeb3();
    const addItemsParams = [
        itemProps.storeId,
        web3.utils.toBN(itemProps.sku),
        itemProps.name,
        web3.utils.toBN(itemProps.price),
        web3.utils.toBN(itemProps.availableAmount)
    ];
    return function(dispatch) {
        contract.methods.addItem(...addItemsParams)
            .send()
            .on('transactionHash', txHash => {
                dispatch(initTx(txHash));
            })
            .on('confirmation', (confirmationNumber, receipt) => {
                dispatch(confirmationTx(confirmationNumber, receipt, itemAdded.bind(null, dispatch)));
            })
            .on('error', (error, receipt) => {
                if(!/User denied transaction signature/.test(error.message)) {
                    console.error(error, receipt);
                }
            });
    }
}
