import { contract } from '../../../util/contracts/marketplace';
import { initTx, confirmationTx } from '../../../tx/ui/expectingConfirmations/ExpectingConfirmationsActions';
import { getWeb3 } from '../../../util/connectors';

export async function itemAdded(dispatch, pullAction, receipt) {
    const { seller, storeId } = receipt.events.ItemCreated.returnValues;
    dispatch(pullAction(seller, storeId, true));
}

export function addItem(itemProps, pullAction) {
    const web3 = getWeb3();
    const addItemsParams = [
        itemProps.storeId,
        web3.utils.toBN(itemProps.sku),
        itemProps.name,
        web3.utils.toBN(itemProps.price),
        web3.utils.toBN(itemProps.availableNumItems)
    ];
    return function(dispatch) {
        contract.methods.addItem(...addItemsParams)
            .send()
            .on('transactionHash', txHash => {
                dispatch(initTx(txHash));
            })
            .on('confirmation', (confirmationNumber, receipt) => {
                dispatch(confirmationTx(confirmationNumber, receipt, itemAdded.bind(null, dispatch, pullAction)));
            })
            .on('error', (error, receipt) => {
                if(!/User denied transaction signature/.test(error.message)) {
                    console.error(error, receipt);
                }
            });
    }
}
