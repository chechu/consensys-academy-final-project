const utils = require('./utils');
const Marketplace = artifacts.require("./Marketplace.sol");

contract('Marketplace', function(accounts) {

    const ROLES = {
        ADMIN: 0,
        SELLER: 1,
        BUYER: 2,
    }

    let marketplaceInstance;
    const [owner, admin, seller, buyer, secondarySeller, secondaryBuyer] = accounts;
    utils.setAccounts([owner, admin, seller, buyer, secondarySeller, secondaryBuyer]);

    beforeEach('setup contract for tests', async () => {
        marketplaceInstance = await Marketplace.deployed();
    });

    describe('Testing permissions', () => {
        beforeEach('setup accounts for tests', async () => {
            await marketplaceInstance.addAdmin(admin, {from: owner});

            // To ensure that `seller` is a not a Seller yet in the Contract
            await marketplaceInstance.removeSeller(seller, {from: admin});
            await marketplaceInstance.removeSeller(secondarySeller, {from: admin});
        });

        it('should return role BUYER for unknown user', async () => {
            const role = await marketplaceInstance.getRole({from: buyer});
            assert.equal(role, ROLES.BUYER, 'The role BUYER wasn\'t set');
        });

        it('should set the role ADMIN by the Owner', async () => {
            // When
            const tx = await marketplaceInstance.addAdmin(admin, {from: owner});

            // Then
            assert.equal(tx.logs[0].event, 'AdminAdded');
            assert.equal(tx.logs[0].args.newAdmin.toString(), admin);
            const role = await marketplaceInstance.getRole({from: admin});
            assert.equal(role, ROLES.ADMIN, 'The role ADMIN wasn\'t set');
        });

        it('should set the role SELLER by an ADMIN', async () => {
            // Given
            await marketplaceInstance.addAdmin(admin, {from: owner});

            // When
            const tx = await marketplaceInstance.addSeller(seller, {from: admin});

            // Then
            assert.equal(tx.logs[0].event, 'SellerAdded');
            assert.equal(tx.logs[0].args.newSeller.toString(), seller);

            const role = await marketplaceInstance.getRole({from: seller});
            assert.equal(role, ROLES.SELLER, 'The role SELLER wasn\'t set');

            const numSellers = await marketplaceInstance.getNumberOfSellers({from: buyer});
            assert.equal(numSellers, 1, 'The number of sellers is incorrect');
        });

        it('should remove a SELLER by an ADMIN', async () => {
            // Given
            await marketplaceInstance.addAdmin(admin, {from: owner});
            await marketplaceInstance.addSeller(seller, {from: admin});

            // When
            const tx = await marketplaceInstance.removeSeller(seller, {from:admin});

            // Then
            assert.equal(tx.logs[0].event, 'SellerRemoved');
            assert.equal(tx.logs[0].args.oldSeller.toString(), seller);

            const role = await marketplaceInstance.getRole({from: seller});
            assert.equal(role, ROLES.BUYER, 'The role SELLER wasn\'t set');

            const numSellers = await marketplaceInstance.getNumberOfSellers({from: buyer});
            assert.equal(numSellers, 0, 'The number of sellers is incorrect');
        });

        it('should avoid removing a SELLER by another SELLER', async () => {
            // Given
            await marketplaceInstance.addAdmin(admin, {from: owner});
            await marketplaceInstance.addSeller(secondarySeller, {from: admin});

            // When
            try {
                await marketplaceInstance.removeSeller(secondarySeller, {from:seller});
                assert.fail('One seller has removed another seller');
            } catch (error) {
                // Then -> success
            }
        });
    });

    describe('Testing stores', () => {
        beforeEach('setup accounts for tests', async () => {
            await utils.resetAccountRoles(marketplaceInstance);
            await utils.resetStores(marketplaceInstance);
        });

        describe('Creating stores', () => {
            it('should allow to add a store for a seller', async () => {
                // Given
                const storeName = 'TestStore:simple';

                // When
                const tx = await marketplaceInstance.addStore(storeName, { from: seller });

                // Then
                assert.equal(tx.logs[0].event, 'StoreCreated');
                assert.equal(tx.logs[0].args.seller.toString(), seller);
                assert.equal(tx.logs[0].args.name.toString(), storeName);
            });

            it('shouldn\'t allow to add two stores with the same name, for the same seller', async () => {
                // Given
                const storeName = 'TestStore:duplicated';

                // When
                await marketplaceInstance.addStore(storeName, { from: seller });
                try {
                    await marketplaceInstance.addStore(storeName, { from: seller });
                    assert.fail('Two stores with the same name has been added for the same seller');
                } catch (error) {
                    // Then -> success
                }
            });

            it('shouldn\'t allow to add a store without name', async () => {
                // Given
                const storeName = '';

                // When
                try {
                    await marketplaceInstance.addStore(storeName, { from: seller });
                    assert.fail('A store with an empty name has been added');
                } catch (error) {
                    // Then -> success
                }
            });

            it('shouldn\'t allow to add a store for a non-seller', async () => {
                // Given
                const storeName = 'TestStore:seller';

                try {
                    // When
                    await marketplaceInstance.addStore(storeName, { from: buyer });
                    assert.fail('A buyer cannot add a store');
                } catch (error) {
                    // Then -> success
                }
            });
        });

        describe('Counting added stores', () => {
            it('should get number of added stores', async() => {
                // Given
                const storeName = 'TestStore:counting:';
                await marketplaceInstance.addStore(storeName + '1', { from: seller });
                await marketplaceInstance.addStore(storeName + '2', { from: seller });
                await marketplaceInstance.addStore(storeName + '3', { from: seller });

                // When
                const numStores = await marketplaceInstance.getNumberOfStores.call(seller);

                // Then
                assert.equal(numStores, 3);
            });

            it('should get zero if no store is added', async () => {
                // When
                const numStores = await marketplaceInstance.getNumberOfStores.call(seller);

                // Then
                assert.equal(numStores, 0);
            });
        });

        describe('Getting store data', () => {
            it('should get return a deterministic store id', async () => {
                // Given
                const storeName = 'TestStore:getting';
                await marketplaceInstance.addStore(storeName, { from: seller });

                // When
                const storeId = await marketplaceInstance.getStoreId.call(seller, 0);

                // Then
                assert.equal(storeId.toString(), '0x919591938c1925b99008bbc43aa5693f4567519de87d2923c28776acd234ceed');
            });

            it('should get the metadata associated with a store', async() => {
                // Given
                const storeName = 'TestStore:metadata';
                const itemName = 'TestItem:metadata';
                await marketplaceInstance.addStore(storeName, { from: seller });
                const storeId = await marketplaceInstance.getStoreId.call(seller, 0);
                await marketplaceInstance.addItem(storeId, 1, itemName, 1, 1, {from:seller});

                // When
                const response = await marketplaceInstance.getStoreMetadata.call(seller, storeId);

                // Then
                assert.equal(response['0'], storeName);
                assert.equal(response['1'], 1); // number of items in the store
            });
        });
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
