const utils = require('./utils');
const Marketplace = artifacts.require("./Marketplace.sol");

contract('Marketplace', function(accounts) {
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
            await utils.removeSellers(marketplaceInstance);
        });

        it('should return role BUYER for unknown user', async () => {
            const role = await marketplaceInstance.getRole({from: buyer});
            assert.equal(role, utils.ROLES.BUYER, 'The role BUYER wasn\'t set');
        });

        it('should set the role ADMIN by the Owner', async () => {
            // When
            const tx = await marketplaceInstance.addAdmin(admin, {from: owner});

            // Then
            assert.equal(tx.logs[0].event, 'AdminAdded');
            assert.equal(tx.logs[0].args.newAdmin.toString(), admin);
            const role = await marketplaceInstance.getRole({from: admin});
            assert.equal(role, utils.ROLES.ADMIN, 'The role ADMIN wasn\'t set');
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
            assert.equal(role, utils.ROLES.SELLER, 'The role SELLER wasn\'t set');

            const numSellers = await marketplaceInstance.getNumberOfSellers({from: buyer});
            assert.equal(numSellers, 1, 'The number of sellers is incorrect');
        });

        it('should remove a SELLER by an ADMIN', async () => {
            // Given
            await marketplaceInstance.addAdmin(admin, {from: owner});
            await marketplaceInstance.addSeller(seller, {from: admin});

            // When - Remove the unique seller in the contract, withn index 0
            const tx = await marketplaceInstance.removeSeller(0, {from:admin});

            // Then
            assert.equal(tx.logs[0].event, 'SellerRemoved');
            assert.equal(tx.logs[0].args.oldSeller.toString(), seller);

            const role = await marketplaceInstance.getRole({from: seller});
            assert.equal(role, utils.ROLES.BUYER, 'The role SELLER wasn\'t set');

            const numSellers = await marketplaceInstance.getNumberOfSellers({from: buyer});
            assert.equal(numSellers, 0, 'The number of sellers is incorrect');
        });

        it('should avoid removing a SELLER by another SELLER', async () => {
            // Given
            await marketplaceInstance.addAdmin(admin, {from: owner});
            await marketplaceInstance.addSeller(secondarySeller, {from: admin});

            // When
            try {
                await marketplaceInstance.removeSeller(0, {from:seller});
                assert.fail('One seller has removed another seller');
            } catch (error) {
                // Then -> success
            }
        });
    });
});
