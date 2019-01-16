const Marketplace = artifacts.require("./Marketplace.sol");

contract('Marketplace', function(accounts) {

    const ROLES = {
        ADMIN: 0,
        SELLER: 1,
        BUYER: 2,
    }

    const [owner, admin, seller, buyer] = accounts;
    let marketplaceInstance;

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
            await marketplaceInstance.addAdmin(admin, {from: owner});

            // To ensure that `seller` is a Seller in the Contract
            await marketplaceInstance.removeSeller(seller, {from: admin})
            await marketplaceInstance.addSeller(seller, {from: admin});
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
        });
    });
});
