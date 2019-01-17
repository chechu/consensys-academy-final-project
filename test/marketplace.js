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
        });
    });

    describe('Testing stores', () => {
        beforeEach('setting accounts', async () => {
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

            it('should get the metada associated with a store', async() => {
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
        beforeEach('setting accounts', async () => {
            await utils.resetAccountRoles(marketplaceInstance);
            await utils.resetStores(marketplaceInstance);
        });

        describe('Creating items', () => {
            it('should allow a seller to add an item in its store', async () => {
                // Given
                const storeName = 'TestStore:addItem';
                const item = { sku: 1, name: 'TestItem:addItem', price: 1, amount: 1 };
                await marketplaceInstance.addStore(storeName, { from: seller });
                const storeId = await marketplaceInstance.getStoreId.call(seller, 0);

                // When
                const tx = await marketplaceInstance.addItem(storeId, item.sku, item.name, item.price, item.amount, {from:seller});

                // Then
                assert.equal(tx.logs[0].event, 'ItemCreated');
                assert.equal(tx.logs[0].args.seller.toString(), seller);
                assert.equal(tx.logs[0].args.storeId.toString(), storeId);
                assert.equal(tx.logs[0].args.sku, item.sku);
                assert.equal(tx.logs[0].args.name, item.name);
                assert.equal(tx.logs[0].args.price, item.price);
                assert.equal(tx.logs[0].args.availableAmount, item.amount);
            });

            it('shouldn\'t allow to add an item for a different seller owner', async () => {
                // Given
                const storeName = 'TestStore:addItemAnotherSeller';
                const item = { sku: 1, name: 'TestItem:addItemAnotherSeller', price: 1, amount: 1 };
                await marketplaceInstance.addStore(storeName, { from: seller });
                const storeId = await marketplaceInstance.getStoreId.call(seller, 0);

                try {
                    // When
                    await marketplaceInstance.addItem(storeId, item.sku, item.name, item.price, item.amount, {from:seller});
                    assert.fail('A buyer cannot add an item');
                } catch (error) {
                    // Then -> success
                }
            });

            it('shouldn\'t allow to add an item for a non-seller', async () => {
                // Given
                const storeName = 'TestStore:addItemNoSeller';
                const item = { sku: 1, name: 'TestItem:addItemNoSeller', price: 1, amount: 1 };
                await marketplaceInstance.addStore(storeName, { from: seller });
                const storeId = await marketplaceInstance.getStoreId.call(seller, 0);

                try {
                    // When
                    await marketplaceInstance.addItem(storeId, item.sku, item.name, item.price, item.amount, {from:secondarySeller});
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
                    { sku: 1, name: 'TestItem:getSku1', price: 1, amount: 1 },
                    { sku: 2, name: 'TestItem:getSku2', price: 1, amount: 1 },
                    { sku: 3, name: 'TestItem:getSku3', price: 1, amount: 1 },
                ];

                // Adding a store for the seller
                await marketplaceInstance.addStore(storeName, { from: seller });
                const storeId = await marketplaceInstance.getStoreId.call(seller, 0);

                // Adding the three items to the store, and wait for it
                await Promise.all(items.map(item => marketplaceInstance.addItem(storeId, item.sku, item.name, item.price, item.amount, {from:seller})));

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
            it('should get the metada associated with a store', async() => {
                // Given
                const storeName = 'TestStore:itemMetadata';
                const item = { sku: 1, name: 'TestItem:itemMetadata', price: 5, amount: 10 };
                await marketplaceInstance.addStore(storeName, { from: seller });
                const storeId = await marketplaceInstance.getStoreId.call(seller, 0);
                await marketplaceInstance.addItem(storeId, item.sku, item.name, item.price, item.amount, {from:seller});
                const sku = await marketplaceInstance.getSku.call(seller, storeId, 0); // getting the sku of the first (and unique) item

                // When
                const response = await marketplaceInstance.getItemMetadata.call(seller, storeId, sku, {from:buyer});

                // Then
                assert.equal(sku, item.sku);
                assert.equal(response['0'], item.name);
                assert.equal(response['1'], item.price);
                assert.equal(response['2'], item.amount);
            });
        });
    });
});
