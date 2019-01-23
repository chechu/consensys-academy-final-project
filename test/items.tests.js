const utils = require('./utils');
const Marketplace = artifacts.require("./Marketplace.sol");

contract('Marketplace', function(accounts) {
    let marketplaceInstance;
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

        describe('Creating items', () => {
            it('should allow a seller to add an item in its store', async () => {
                // Given
                const storeName = 'TestStore:addItem';
                const item = { sku: 1, name: 'TestItem:addItem', price: 1, availableNumItems: 1 };
                await marketplaceInstance.addStore(storeName, { from: seller });
                const storeId = await marketplaceInstance.getStoreId.call(seller, 0);

                // When
                const tx = await marketplaceInstance.addItem(storeId, item.sku, item.name, item.price, item.availableNumItems, {from:seller});

                // Then
                assert.equal(tx.logs[0].event, 'ItemCreated');
                assert.equal(tx.logs[0].args.seller.toString(), seller);
                assert.equal(tx.logs[0].args.storeId.toString(), storeId);
                assert.equal(tx.logs[0].args.sku, item.sku);
                assert.equal(tx.logs[0].args.name, item.name);
                assert.equal(tx.logs[0].args.price, item.price);
                assert.equal(tx.logs[0].args.availableNumItems, item.availableNumItems);
            });

            it('shouldn\'t allow to add an item for a different seller owner', async () => {
                // Given
                const storeName = 'TestStore:addItemAnotherSeller';
                const item = { sku: 1, name: 'TestItem:addItemAnotherSeller', price: 1, availableNumItems: 1 };
                await marketplaceInstance.addStore(storeName, { from: seller });
                const storeId = await marketplaceInstance.getStoreId.call(seller, 0);

                try {
                    // When
                    await marketplaceInstance.addItem(storeId, item.sku, item.name, item.price, item.availableNumItems, {from:seller});
                    assert.fail('A buyer cannot add an item');
                } catch (error) {
                    // Then -> success
                }
            });

            it('shouldn\'t allow to add an item for a non-seller', async () => {
                // Given
                const storeName = 'TestStore:addItemNoSeller';
                const item = { sku: 1, name: 'TestItem:addItemNoSeller', price: 1, availableNumItems: 1 };
                await marketplaceInstance.addStore(storeName, { from: seller });
                const storeId = await marketplaceInstance.getStoreId.call(seller, 0);

                try {
                    // When
                    await marketplaceInstance.addItem(storeId, item.sku, item.name, item.price, item.availableNumItems, {from:secondarySeller});
                    assert.fail('Another seller is trying to add an item in your store');
                } catch (error) {
                    // Then -> success
                }
            });
        });

        describe('Counting added items', () => {
            it('should get number of added items', async() => {
                // Given
                const storeName = 'TestStore:countingItems';
                const items = [
                    { sku: 1, name: 'TestItem:getSku1', price: 1, availableNumItems: 1 },
                    { sku: 2, name: 'TestItem:getSku2', price: 1, availableNumItems: 1 },
                    { sku: 3, name: 'TestItem:getSku3', price: 1, availableNumItems: 1 },
                ];

                // Adding a store for the seller
                await marketplaceInstance.addStore(storeName, { from: seller });
                const storeId = await marketplaceInstance.getStoreId.call(seller, 0);

                // Adding the three items to the store, and wait for it
                await Promise.all(items.map(item => marketplaceInstance.addItem(storeId, item.sku, item.name, item.price, item.availableNumItems, {from:seller})));

                // When
                const numItems = await marketplaceInstance.getNumberOfItems.call(seller, storeId);

                // Then
                assert.equal(numItems, 3);
            });

            it('should get zero if no items are added', async () => {
                // Given
                const storeName = 'TestStore:countingItems';
                await marketplaceInstance.addStore(storeName, { from: seller });
                const storeId = await marketplaceInstance.getStoreId.call(seller, 0);

                // When
                const numItems = await marketplaceInstance.getNumberOfItems.call(seller, storeId);

                // Then
                assert.equal(numItems, 0);
            });
        });

        describe('Getting item data', () => {
            it('should get the metadata associated with an item', async() => {
                // Given
                const storeName = 'TestStore:itemMetadata';
                const item = { sku: 1, name: 'TestItem:itemMetadata', price: 5, availableNumItems: 10 };
                await marketplaceInstance.addStore(storeName, { from: seller });
                const storeId = await marketplaceInstance.getStoreId.call(seller, 0);
                await marketplaceInstance.addItem(storeId, item.sku, item.name, item.price, item.availableNumItems, {from:seller});
                const sku = await marketplaceInstance.getSku.call(seller, storeId, 0); // getting the sku of the first (and unique) item

                // When
                const response = await marketplaceInstance.getItemMetadata.call(seller, storeId, sku, {from:buyer});

                // Then
                assert.equal(sku, item.sku);
                assert.equal(response['0'], item.name);
                assert.equal(response['1'], item.price);
                assert.equal(response['2'], item.availableNumItems);
            });
        });

        describe('Removing items', () => {
            it('should remove one item belonging to the seller', async () => {
                // Given
                const storeName = 'TestStore:itemRemoveOwn';
                const item = { sku: 1, name: 'TestItem:itemRemoveOwn', price: 5, availableNumItems: 10 };
                await marketplaceInstance.addStore(storeName, { from: seller });
                const storeId = await marketplaceInstance.getStoreId.call(seller, 0);
                await marketplaceInstance.addItem(storeId, item.sku, item.name, item.price, item.availableNumItems, {from:seller});
                const sku = await marketplaceInstance.getSku.call(seller, storeId, 0); // getting the sku of the first (and unique) item

                // When
                const tx = await marketplaceInstance.removeItem(storeId, sku, {from:seller});
                const numItems = await marketplaceInstance.getNumberOfItems.call(seller, storeId);

                // Then
                assert.equal(tx.logs[0].event, 'ItemRemoved');
                assert.equal(tx.logs[0].args.seller.toString(), seller);
                assert.equal(tx.logs[0].args.storeId.toString(), storeId);
                assert.equal(tx.logs[0].args.sku, item.sku);
                assert.equal(numItems, 0);
            });

            it('shouldn\'t remove one item belonging to other seller', async () => {
                // Given
                const storeName = 'TestStore:itemRemoveOther';
                const item = { sku: 1, name: 'TestItem:itemRemoveOther', price: 5, availableNumItems: 10 };
                await marketplaceInstance.addStore(storeName, { from: seller });
                const storeId = await marketplaceInstance.getStoreId.call(seller, 0);
                await marketplaceInstance.addItem(storeId, item.sku, item.name, item.price, item.availableNumItems, {from:seller});
                const sku = await marketplaceInstance.getSku.call(seller, storeId, 0); // getting the sku of the first (and unique) item

                try {
                    // When
                    await marketplaceInstance.removeItem(storeId, sku, {from:secondarySeller});
                    assert.fail('Another seller is trying to remove an item in your store');
                } catch (error) {
                    // Then -> success
                }
                const numItems = await marketplaceInstance.getNumberOfItems.call(seller, storeId);

                // Then
                assert.equal(numItems, 1);
            });

            it('shouldn\'t remove a non existing item', async () => {
                // Given
                const storeName = 'TestStore:itemRemoveOther';
                const item = { sku: 1, name: 'TestItem:itemRemoveOther', price: 5, availableNumItems: 10 };
                await marketplaceInstance.addStore(storeName, { from: seller });
                const storeId = await marketplaceInstance.getStoreId.call(seller, 0);
                await marketplaceInstance.addItem(storeId, item.sku, item.name, item.price, item.availableNumItems, {from:seller});

                try {
                    // When
                    await marketplaceInstance.removeItem(storeId, item.sku + 1, {from:secondarySeller});
                    assert.fail('A seller has remove a non existing item');
                } catch (error) {
                    // Then -> success
                }
                const numItems = await marketplaceInstance.getNumberOfItems.call(seller, storeId);

                // Then
                assert.equal(numItems, 1);
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
