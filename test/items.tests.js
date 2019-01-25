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

        describe('Editing items', () => {
            it('should allow a seller to edit an item in its store', async () => {
                // Given
                const storeName = 'TestStore:editItem';
                const preItem = { sku: 1, name: 'TestItem:editItem', price: 1, availableNumItems: 1 };
                const postItem = { sku: 1, name: 'TestItem:editItemPost', price: 2, availableNumItems: 2 };
                await marketplaceInstance.addStore(storeName, { from: seller });
                const storeId = await marketplaceInstance.getStoreId.call(seller, 0);
                await marketplaceInstance.addItem(storeId, preItem.sku, preItem.name, preItem.price, preItem.availableNumItems, {from:seller});

                // When
                const tx = await marketplaceInstance.editItem(storeId, preItem.sku, postItem.name, postItem.price, postItem.availableNumItems, {from:seller});

                // Then
                assert.equal(tx.logs[0].event, 'ItemEdited');
                assert.equal(tx.logs[0].args.seller.toString(), seller);
                assert.equal(tx.logs[0].args.storeId.toString(), storeId);
                assert.equal(tx.logs[0].args.sku, postItem.sku);
                assert.equal(tx.logs[0].args.name, postItem.name);
                assert.equal(tx.logs[0].args.price, postItem.price);
                assert.equal(tx.logs[0].args.availableNumItems, postItem.availableNumItems);
            });

            it('should avoid edition of non existing items', async () => {
                // Given
                const storeName = 'TestStore:editItemNotExist';
                const item = { sku: 1, name: 'TestItem:editItemNotExist', price: 1, availableNumItems: 1 };
                await marketplaceInstance.addStore(storeName, { from: seller });
                const storeId = await marketplaceInstance.getStoreId.call(seller, 0);
                await marketplaceInstance.addItem(storeId, item.sku, item.name, item.price, item.availableNumItems, {from:seller});

                // When
                try {
                    await marketplaceInstance.editItem(storeId, item.sku + 1, item.name, item.price, item.availableNumItems, {from:seller});
                    assert.fail('A seller is trying to editing an item that does not exist');
                } catch (error) {
                    // Then -> success
                }
            });

            it('should control the requirements of the attributes in the provided ones', async () => {
                // Given
                const storeName = 'TestStore:editItemRequirements';
                const preItem = { sku: 1, name: 'TestItem:editItem', price: 1, availableNumItems: 1 };
                const postItem = { sku: 1, price: 0, availableNumItems: -1 };
                await marketplaceInstance.addStore(storeName, { from: seller });
                const storeId = await marketplaceInstance.getStoreId.call(seller, 0);
                await marketplaceInstance.addItem(storeId, preItem.sku, preItem.name, preItem.price, preItem.availableNumItems, {from:seller});

                // When
                try {
                    // Invalid price
                    await marketplaceInstance.editItem(storeId, preItem.sku, preItem.name, postItem.price, preItem.availableNumItems, {from:seller});
                    assert.fail('Trying to set an invalid price');
                } catch (error) {
                    // Then -> success
                }

                // When
                try {
                    // Invalid number of available items
                    await marketplaceInstance.editItem(storeId, preItem.sku, preItem.name, preItem.price, postItem.availableNumItems, {from:seller});
                    assert.fail('Trying to set an invalid number of available items');
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

            it('should deal with continous add and remove items', async() => {
                // Given - 4 items added to the store
                const storeName = 'TestStore:itemRemoveMix';
                const items = [
                    { sku: 1, name: 'TestItem:itemRemoveMix1', price: 5, availableNumItems: 10 },
                    { sku: 2, name: 'TestItem:itemRemoveMix2', price: 5, availableNumItems: 10 },
                    { sku: 3, name: 'TestItem:itemRemoveMix3', price: 5, availableNumItems: 10 },
                    { sku: 4, name: 'TestItem:itemRemoveMix4', price: 5, availableNumItems: 10 },
                ];
                const newItem = { sku: 5, name: 'TestItem:itemRemoveMix5', price: 5, availableNumItems: 10 };
                await marketplaceInstance.addStore(storeName, { from: seller });
                const storeId = await marketplaceInstance.getStoreId.call(seller, 0);
                await Promise.all(items.map(item => marketplaceInstance.addItem(storeId, item.sku, item.name, item.price, item.availableNumItems, {from:seller})));

                // When
                await marketplaceInstance.removeItem(storeId, items[1].sku, {from:seller});
                await marketplaceInstance.removeItem(storeId, items[3].sku, {from:seller});
                await marketplaceInstance.addItem(storeId, newItem.sku, newItem.name, newItem.price, newItem.availableNumItems, {from:seller});
                await marketplaceInstance.removeItem(storeId, items[0].sku, {from:seller});

                const numItems = await marketplaceInstance.getNumberOfItems.call(seller, storeId);
                const response = await marketplaceInstance.getItemMetadata.call(seller, storeId, newItem.sku, {from:buyer});

                // Then
                assert.equal(numItems, 2);

                // Then
                assert.equal(response['0'], newItem.name);
                assert.equal(response['1'], newItem.price);
                assert.equal(response['2'], newItem.availableNumItems);
            });
        });
    });
});
