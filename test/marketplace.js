const Marketplace = artifacts.require("./Marketplace.sol");

contract('Marketplace', function(accounts) {

    const ROLES = {
        ADMIN: 0,
        SELLER: 1,
        BUYER: 2,
    }

    const [owner, admin, seller, buyer] = accounts;
    let marketplaceInstance;

    beforeEach('setup contract for each test', async () => {
        marketplaceInstance = await Marketplace.deployed();
    })

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
