let owner, admin, seller, buyer, secondarySeller, secondaryBuyer;

const setAccounts = (accounts) => {
    [owner, admin, seller, buyer, secondarySeller, secondaryBuyer] = accounts;
}

const removeSellers = async (marketplaceInstance) => {
    const numSellers = await marketplaceInstance.getNumberOfSellers();
    for(let i = 0; i < numSellers; i++) {
        await marketplaceInstance.removeSeller(0, {from: admin});
    }
}

const resetAccountRoles = async (marketplaceInstance) => {
    await marketplaceInstance.addAdmin(admin, {from: owner});

    // To ensure that `seller` is a Seller in the Contract
    await removeSellers(marketplaceInstance);
    await marketplaceInstance.addSeller(seller, {from: admin});
    await marketplaceInstance.addSeller(secondarySeller, {from: admin});
}

const resetStores = async (marketplaceInstance) => {
    const numStores = await marketplaceInstance.getNumberOfStores.call(seller, {from:seller});
    for(let times = 0; times < numStores; times++) {
        // We'll remove allways the store in index 0, because of the algorithm of removing in the contract
        const storeId = await marketplaceInstance.getStoreId.call(seller, 0, {from:seller});
        const tx = await marketplaceInstance.removeStore(storeId, 0, {from:seller});

        // console.log(`Store removed. Event: [${tx.logs[0].event}]. StoreId: [${tx.logs[0].args.storeId}]`);
    }
}

const purchaseItem = async (marketplaceInstance) => {
    const storeName = `TestStore:purchaseItem:${Date.now()}`;
    const item = { sku: 1, name: `TestItem:purchaseItem:${Date.now()}`, price: 1, availableNumItems: 10 };
    await marketplaceInstance.addStore(storeName, { from: seller });
    const storeId = await marketplaceInstance.getStoreId.call(seller, 0);
    await marketplaceInstance.addItem(storeId, item.sku, item.name, item.price, item.availableNumItems, {from:seller});
    const numItemsToPurchase = 1;
    const valueToPay = numItemsToPurchase * item.price;
    await marketplaceInstance.purchaseItem(seller, storeId, item.sku, numItemsToPurchase, { from: buyer, value: valueToPay});

    return valueToPay;
}

async function getTransactionGasCost(tx, web3) {
    const receipt = await web3.eth.getTransactionReceipt(tx);
    const amount = receipt.gasUsed;
    const transaction = await web3.eth.getTransaction(tx);
    const price = transaction.gasPrice;
    return new web3.utils.BN(price).mul(new web3.utils.BN(amount));
}

const ROLES = {
    ADMIN: 0,
    SELLER: 1,
    BUYER: 2,
}

module.exports = {
    setAccounts,
    resetAccountRoles,
    removeSellers,
    resetStores,
    purchaseItem,
    getTransactionGasCost,
    ROLES,
}
