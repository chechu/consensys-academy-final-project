const HDWalletProvider = require('truffle-hdwallet-provider');
const privateConfig = require('./privateConfig');

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(privateConfig.privateDeployerKey, `https://rinkeby.infura.io/v3/${privateConfig.infuraKey}`)
      },
      network_id: 4
    }   
  }
};
