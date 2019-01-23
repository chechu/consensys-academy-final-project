const utils = require('./utils');
const Marketplace = artifacts.require("./Marketplace.sol");

contract('Marketplace', function(accounts) {
    let marketplaceInstance;
    const BN = web3.utils.BN;
    const [owner, admin, seller, buyer, secondarySeller, secondaryBuyer] = accounts;
    utils.setAccounts([owner, admin, seller, buyer, secondarySeller, secondaryBuyer]);

    beforeEach('setup contract for tests', async () => {
        marketplaceInstance = await Marketplace.deployed();
    });

    describe('Testing items', () => {
        beforeEach('setup accounts for tests', async () => {
            await utils.resetAccountRoles(marketplaceInstance);
            await utils.resetStores(marketplaceInstance);
        });

        describe('Withdrawing funds', () => {
            it('should allow to withdraw funds for a seller', async() => {
                // Given
                const valueToPay = await utils.purchaseItem(marketplaceInstance);
                const initialBalance = new BN(await web3.eth.getBalance(seller));

                // When
                const tx = await marketplaceInstance.withdraw({from:seller});

                // Then
                const newBalance = new BN(await web3.eth.getBalance(seller));
                const gasCost = await utils.getTransactionGasCost(tx.tx, web3);
                const expectedBalance = initialBalance.add(new BN(valueToPay)).sub(gasCost);

                assert.deepEqual(newBalance, expectedBalance, 'Balance incorrect after withdrawing');
            });
        });

        describe('Purchasing items', () => {
            it('should allow a buyer to purchase items', async () => {
                // Given
                const storeName = 'TestStore:purchaseItem';
                const item = { sku: 1, name: 'TestItem:purchaseItem', price: 1, availableNumItems: 10 };
                await marketplaceInstance.addStore(storeName, { from: seller });
                const storeId = await marketplaceInstance.getStoreId.call(seller, 0);
                await marketplaceInstance.addItem(storeId, item.sku, item.name, item.price, item.availableNumItems, {from:seller});
                const numItemsToPurchase = 5;
                const valueToPay = numItemsToPurchase * item.price;
                const initialBalance = new BN(await web3.eth.getBalance(buyer));

                // When
                const tx = await marketplaceInstance.purchaseItem(seller, storeId, item.sku, numItemsToPurchase, { from: buyer, value: valueToPay});

                // Then
                // Checking event
                assert.equal(tx.logs[0].event, 'ItemPurchased');
                assert.equal(tx.logs[0].args.seller.toString(), seller);
                assert.equal(tx.logs[0].args.storeId.toString(), storeId);
                assert.equal(tx.logs[0].args.sku, item.sku);
                assert.equal(tx.logs[0].args.numPurchasedItems, numItemsToPurchase);
                assert.equal(tx.logs[0].args.newAvailableNumItems, item.availableNumItems - numItemsToPurchase);

                // Checking balance
                const newBalance = new BN(await web3.eth.getBalance(buyer));
                const gasCost = await utils.getTransactionGasCost(tx.tx, web3);
                const expectedBalance = initialBalance.sub(new BN(valueToPay)).sub(gasCost);
                assert.deepEqual(newBalance, expectedBalance, 'Balance incorrect after purchasing');
            });

            it('should allow a buyer to purchase every item with a specific sku', async () => {
                // Given
                const storeName = 'TestStore:purchaseEveryItem';
                const item = { sku: 1, name: 'TestItem:purchaseEveryItem', price: 1, availableNumItems: 10 };
                await marketplaceInstance.addStore(storeName, { from: seller });
                const storeId = await marketplaceInstance.getStoreId.call(seller, 0);
                await marketplaceInstance.addItem(storeId, item.sku, item.name, item.price, item.availableNumItems, {from:seller});
                const numItemsToPurchase = item.availableNumItems;
                const valueToPay = numItemsToPurchase * item.price;

                // When
                const tx = await marketplaceInstance.purchaseItem(seller, storeId, item.sku, numItemsToPurchase, { from: buyer, value: valueToPay});

                // Then
                assert.equal(tx.logs[0].event, 'ItemPurchased');
                assert.equal(tx.logs[0].args.seller.toString(), seller);
                assert.equal(tx.logs[0].args.storeId.toString(), storeId);
                assert.equal(tx.logs[0].args.sku, item.sku);
                assert.equal(tx.logs[0].args.numPurchasedItems, numItemsToPurchase);
                assert.equal(tx.logs[0].args.newAvailableNumItems, item.availableNumItems - numItemsToPurchase);
            });

            it('should avoid to purchase an item if it doesn\'t exist', async () => {
                // Given
                const storeName = 'TestStore:purchaseItemNonExist';
                const item = { sku: 1, name: 'TestItem:purchaseItemNonExist', price: 1, availableNumItems: 10 };
                await marketplaceInstance.addStore(storeName, { from: seller });
                const storeId = await marketplaceInstance.getStoreId.call(seller, 0);
                await marketplaceInstance.addItem(storeId, item.sku, item.name, item.price, item.availableNumItems, {from:seller});
                const numItemsToPurchase = 5;
                const valueToPay = numItemsToPurchase * item.price;

                // When
                try {
                    await marketplaceInstance.purchaseItem(seller, storeId, item.sku + 1, numItemsToPurchase, { from: buyer, value: valueToPay});
                    assert.fail('One item has been purchased but it doesn\'t exist');
                } catch (error) {
                    // Then -> success
                }
            });

            it('should avoid to purchase an invalid number of items', async () => {
                // Given
                const storeName = 'TestStore:purchaseItemInvalidNumber';
                const item = { sku: 1, name: 'TestItem:purchaseItemInvalidNumber', price: 1, availableNumItems: 10 };
                await marketplaceInstance.addStore(storeName, { from: seller });
                const storeId = await marketplaceInstance.getStoreId.call(seller, 0);
                await marketplaceInstance.addItem(storeId, item.sku, item.name, item.price, item.availableNumItems, {from:seller});
                const valueToPay = item.price;

                // When
                let numItemsToPurchase = -1;
                try {
                    await marketplaceInstance.purchaseItem(seller, storeId, item.sku, numItemsToPurchase, { from: buyer, value: valueToPay});
                    assert.fail('A negative number of items has been purchased');
                } catch (error) {
                    // Then -> success
                }

                // When
                numItemsToPurchase = item.availableNumItems + 1;
                try {
                    await marketplaceInstance.purchaseItem(seller, storeId, item.sku, numItemsToPurchase, { from: buyer, value: valueToPay});
                    assert.fail('It has been purchased more items than the available ones');
                } catch (error) {
                    // Then -> success
                }
            });

            it('should avoid to purchase an item with an invalid value', async () => {
                // Given
                const storeName = 'TestStore:purchaseItemInvalidValue';
                const item = { sku: 1, name: 'TestItem:purchaseItemInvalidValue', price: 1, availableNumItems: 10 };
                await marketplaceInstance.addStore(storeName, { from: seller });
                const storeId = await marketplaceInstance.getStoreId.call(seller, 0);
                await marketplaceInstance.addItem(storeId, item.sku, item.name, item.price, item.availableNumItems, {from:seller});
                const numItemsToPurchase = 5;

                // When
                let valueToPay = (numItemsToPurchase * item.price) - 1; // Insufficient value
                try {
                    await marketplaceInstance.purchaseItem(seller, storeId, item.sku + 1, numItemsToPurchase, { from: buyer, value: valueToPay});
                    assert.fail('One item has been purchased with less value than demanded');
                } catch (error) {
                    // Then -> success
                }

                // When
                valueToPay = (numItemsToPurchase * item.price) + 1; // Excessive value
                try {
                    await marketplaceInstance.purchaseItem(seller, storeId, item.sku + 1, numItemsToPurchase, { from: buyer, value: valueToPay});
                    assert.fail('One item has been purchased with more value than demanded');
                } catch (error) {
                    // Then -> success
                }
            });
        });

    });
});
