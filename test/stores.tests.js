const utils = require('./utils');
const Marketplace = artifacts.require("./Marketplace.sol");

contract('Marketplace', function(accounts) {
    let marketplaceInstance;
    const [owner, admin, seller, buyer, secondarySeller, secondaryBuyer] = accounts;
    utils.setAccounts([owner, admin, seller, buyer, secondarySeller, secondaryBuyer]);

    beforeEach('setup contract for tests', async () => {
        marketplaceInstance = await Marketplace.deployed();
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
            // Skiping this test because it depends on the sender address, so you should run Ganache with specific accounts; otherwise it would fail
            it.skip('should get return a deterministic store id', async () => {
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
});
