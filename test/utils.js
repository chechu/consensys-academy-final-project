let owner, admin, seller, buyer, secondarySeller, secondaryBuyer;

const setAccounts = (accounts) => {
    [owner, admin, seller, buyer, secondarySeller, secondaryBuyer] = accounts;
}
const resetAccountRoles = async (marketplaceInstance) => {
    await marketplaceInstance.addAdmin(admin, {from: owner});

    // To ensure that `seller` is a Seller in the Contract
    await marketplaceInstance.removeSeller(seller, {from: admin});
    await marketplaceInstance.removeSeller(secondarySeller, {from: admin});
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

module.exports = {
    setAccounts,
    resetAccountRoles,
    resetStores,
}
