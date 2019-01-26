# ConsenSys Academy’s 2018-2019 Developer Program Final Project

This the repository of the ConsenSys Academy’s 2018-2019 Developer Program Final Project develop by [Jesús Lanchas Sampablo](https://github.com/chechu).

## Content

1. [Description](#description)
2. [Set up](#set-up)
3. [Flows](#flows)

## Description

This DApp simulates a marketplace based on Ethereum. The main components are:

* Web application. React project with the user interfact to interact with the contracts.

* Smart contract [*Marketplace*](https://github.com/chechu/consensys-academy-final-project/blob/master/contracts/Marketplace.sol). It manages the data associated with the marketplace in Ethereum: list of users, stores and items.

* Smart contract [*KrakenPriceTicker*](https://github.com/chechu/consensys-academy-final-project/blob/master/contracts/KrakenPriceTicker.sol). Based on [this one](https://github.com/oraclize/ethereum-examples/blob/master/solidity/KrakenPriceTicker.sol), it allows to keep updated the exchange ration ETH-USD using a oracle of [Oraclize](http://www.oraclize.it/).

## Set up

To configure an run the web application in local, connected to smart contracts deployed in a local running Ganache, follow the next steps:

1. Clone this repository:

```
$> git clone git@github.com:chechu/consensys-academy-final-project.git
```

2. Install dependencies

```
$> npm install
```

3. Run Ganache locally

```
$> ganache-cli
```

4. Edit the file `privateConfig.js`, to provide this data:
 * Private key to use in the contract's migrations
 * [Infura](https://infura.io/dashboard) project id to use in the contract's deployment in Rinkeby. You can create a new project from the Infura dashboard, and copy the project id provided.

5. Deploy the contracts
```
$> truffle migrate --reset
```
Some features are only available on Rinkeby: ENS and Oraclize integration. To deploy the contracts on Rinkeby you can add `--network rinkeby` to the previous truffle command.

## Flows


