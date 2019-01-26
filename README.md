# ConsenSys Academy’s 2018-2019 Developer Program Final Project

This the repository of the ConsenSys Academy’s 2018-2019 Developer Program Final Project develop by [Jesús Lanchas Sampablo](https://github.com/chechu).

## Content

1. [Description](#description)
2. [Local set up](#local-set-up)
3. [Rinkeby set up](#rinkeby-set-up)
4. [Flows](#flows)
 1. [Configure accounts in the application](#configure-accounts-in-the-application)
 2. [Buying and purchasing](#buying-and-purchasing)
 3. [Buying and purchasing](#buying-and-purchasing)
5. [Design pattern desicions](/design_pattern_desicions)
6. [Avoiding common attacks](/avoiding_common_attacks)

## Description

This DApp simulates a marketplace based on Ethereum. The main components are:

* Web application. React project with the user interfact to interact with the contracts.

* Smart contract [*Marketplace*](https://github.com/chechu/consensys-academy-final-project/blob/master/contracts/Marketplace.sol). It manages the data associated with the marketplace in Ethereum: list of users, stores and items.

* Smart contract [*KrakenPriceTicker*](https://github.com/chechu/consensys-academy-final-project/blob/master/contracts/KrakenPriceTicker.sol). Based on [this one](https://github.com/oraclize/ethereum-examples/blob/master/solidity/KrakenPriceTicker.sol), it allows to keep updated the exchange ration ETH-USD using a oracle of [Oraclize](http://www.oraclize.it/).

## Local set up

### Create ETH accounts to test the DApp

Before running the application, my recommendation is to create **four ETH accounts**, that will have the following roles in the application: Deployer, Admin, Seller and Buyer. You can use Metamask to create these accounts. The roles are isolated, inheritance is not supported (for instance, an user with the role ADMIN cannot buy things, only an user with the role BUYER can do it).

Provide these accounts with enough ether. You can do that easily in a local environemnt adding the following options to the Ganache command (step 3 in the following instructions):

```
--account=<private key>,<balance in wei>
```

### Set up the artifacts

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
Note: if you want to provide ether to some specific accounts, add the following option as many time as you need: `--account=<private key 1>,<balance 1> --account=<private key 2>,<balance 2> ...`

4. Edit the file `privateConfig.js`, to provide this data:
 * Private key of the Ethereum account to use as deployer in the contract's migrations
 * [Infura](https://infura.io/dashboard) project id to use in the contract's deployment in Rinkeby. You can create a new project from the Infura dashboard, and copy the project id provided.

5. Deploy the contracts
```
$> truffle migrate --reset
```
Some features are only available on Rinkeby: ENS and Oraclize integration. To deploy the contracts on Rinkeby you can add `--network rinkeby` to the previous truffle command.

6. Update the file `config.js` with the ETH addresses where the contracts has been deployed. Note: KrakenPriceTicker is only deployed on Rinkeby.

7. Run a local server providing the web application
```
$> npm run start
```

## Rinkeby set up

The contracts are deployed in Rinkeby in the following addresses:
* Marketplace: [0xA41Bb3a4bBCA2F33D91f14731aA4f73C71f75E7E](https://rinkeby.etherscan.io/address/0xA41Bb3a4bBCA2F33D91f14731aA4f73C71f75E7E)
* Kraken Price Ticker: [0x4e1655596E0AAd6611e94E9D1bBEf3C92A67Cb08](https://rinkeby.etherscan.io/address/0x4e1655596E0AAd6611e94E9D1bBEf3C92A67Cb08)

These address are included in the codebase, so you don't need to change it to connect to Rinkeby, just run the local server with `npm run start`.

## Flows

### Configure accounts in the application
1. Go to http://localhost:3000

![Home page](/doc/images/home.png)

2. Select in Metamask the account used as deployer
3. Click on "Login with Browser" (top right corner)
4. You will access to the dashboard of the contract's owner. In this dashboard you could add new administrators and set the emergency flag in the contract (that will disable every write operation, except the withdrawal). In "Add seller" form you can add an ETH address to include it as administrator of the application.

![Owner page](/doc/images/owner.png)

5. Logout, change your Metamask account to select the Admin account and refresh the page (sometimes the web application doesn't take care of the change in Metamaks)
6. Login again. Now you should see the dashboard of an Admin account, allowing you to add new sellers.

![Admin page](/doc/images/admin.png)

7. Add a different ETH address as seller. Logout, select this Seller addres in Metamask and refresh the page and login again. Now you should see the dashboard of a Seller account, allowing you to add new stores.

![Seller page](/doc/images/seller.png)

8. Add some stores and some items on each store.
![Add item](/doc/images/addItem.png)

### Buying and purchasing

1. Logout, select the Buyer account in Metamask and login again. Now you should see the dashboard of a Buyer account, with the list of every store of every seller in the application.

![Buyer page](/doc/images/buyer.png)

2. Select any store. You will see the list of items in that store.

![Items](/doc/images/store.png)

3. Click on the green buttom on any item to select the number of items that you want to buy.

![Purchase](/doc/images/purchase.png)

4. Accept the transaction. Take into account that this transaction include the value to buy the item(s).

5. Login as the seller of the purcased item, and go to your Profile (link in the top right corner). From that you will be able to withdraw your funds.

![Withdraw](/doc/images/withdraw.png)
