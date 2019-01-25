const Marketplace = artifacts.require('./Marketplace.sol');
const KrakenPriceTicker = artifacts.require('./KrakenPriceTicker.sol');

module.exports = function(deployer, network) {
    deployer.deploy(Marketplace);

    if (network === 'rinkeby') {
        deployer.deploy(KrakenPriceTicker);
    }
};
