import { contract } from '../../../util/contracts/marketplace';
import { initTx, confirmationTx } from '../../../tx/ui/expectingConfirmations/ExpectingConfirmationsActions';
import { getWeb3 } from '../../../util/connectors';
import { pullItems, USER_BALANCE_UPDATED } from '../../../util/actions';

export async function itemPurchased(dispatch, buyerAddress, receipt) {
    const { seller, storeId } = receipt.events.ItemPurchased.returnValues;
    dispatch(pullItems(seller, storeId, true));

    const newBalance = await getWeb3().eth.getBalance(buyerAddress);
    dispatch({ type: USER_BALANCE_UPDATED, newBalance });
}

export function checkoutItem(itemProps, numItemsToPurchase) {
    const web3 = getWeb3();
    const checkoutItemsParams = [
        itemProps.sellerAddress,
        itemProps.storeId,
        web3.utils.toBN(itemProps.sku),
        web3.utils.toBN(numItemsToPurchase),
    ];
    return function(dispatch) {
        const value = web3.utils.toBN(itemProps.price).mul(web3.utils.toBN(numItemsToPurchase));
        contract.methods.purchaseItem(...checkoutItemsParams)
            .send({ value })
            .on('transactionHash', txHash => {
                dispatch(initTx(txHash));
            })
            .on('confirmation', (confirmationNumber, receipt) => {
                dispatch(confirmationTx(confirmationNumber, receipt, itemPurchased.bind(null, dispatch, this.props.buyerAddress)));
            })
            .on('error', (error, receipt) => {
                if(!/User denied transaction signature/.test(error.message)) {
                    console.error(error, receipt);
                }
            });
    }
}
