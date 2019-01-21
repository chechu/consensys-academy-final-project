import { contract } from '../../../util/contracts/marketplace';
import { initTx, confirmationTx } from '../../../tx/ui/expectingConfirmations/ExpectingConfirmationsActions';
import { getWeb3 } from '../../../util/connectors';
import { pullItems } from '../../../util/actions';

export async function itemEdited(dispatch, receipt) {
    const { seller, storeId } = receipt.events.ItemEdited.returnValues;
    dispatch(pullItems(seller, storeId, true));
}

export function editItem(itemProps) {
    const web3 = getWeb3();
    const editItemParams = [
        itemProps.storeId,
        web3.utils.toBN(itemProps.sku),
        itemProps.name,
        web3.utils.toBN(itemProps.price),
        web3.utils.toBN(itemProps.availableAmount)
    ];
    console.log({editItemParams});
    return function(dispatch) {
        contract.methods.editItem(...editItemParams)
            .send()
            .on('transactionHash', txHash => {
                dispatch(initTx(txHash));
            })
            .on('confirmation', (confirmationNumber, receipt) => {
                dispatch(confirmationTx(confirmationNumber, receipt, itemEdited.bind(null, dispatch)));
            })
            .on('error', (error, receipt) => {
                if(!/User denied transaction signature/.test(error.message)) {
                    console.error(error, receipt);
                }
            });
    }
}
