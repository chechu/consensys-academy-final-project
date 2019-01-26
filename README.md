# ConsenSys Academy’s 2018-2019 Developer Program Final Project

This the repository of the ConsenSys Academy’s 2018-2019 Developer Program Final Project develop by [Jesús Lanchas Sampablo](https://github.com/chechu).

## Content

1. [Introduction](#introduction)
2. [Local set up](#local-set-up)
3. [Rinkeby set up](#rinkeby-set-up)
4. [Flows](#flows)
   * [Configure accounts in the application](#configure-accounts-in-the-application)
   * [Buying and purchasing](#buying-and-purchasing)
5. [Integrations](#integrations)
   * [Uport](#uport)
   * [Oraclize](#oraclize)
   * [ENS](#ens)
   * [Open Zeppelin](#open-zeppelin)
6. [Design pattern desicions](/design_pattern_desicions.md)
7. [Avoiding common attacks](/avoiding_common_attacks.md)

## Introduction

This DApp simulates a marketplace based on Ethereum. The main components are:

* **Web application**. React project with the user interfact to interact with the contracts.
* **Smart contract [_Marketplace_](https://github.com/chechu/consensys-academy-final-project/blob/master/contracts/Marketplace.sol)**. It manages the data associated with the marketplace in Ethereum: list of users, stores and items.

* **Smart contract [_KrakenPriceTicker_](https://github.com/chechu/consensys-academy-final-project/blob/master/contracts/KrakenPriceTicker.sol)**. Based on [this one](https://github.com/oraclize/ethereum-examples/blob/master/solidity/KrakenPriceTicker.sol), it allows to keep updated the exchange ration ETH-USD using a oracle of [Oraclize](http://www.oraclize.it/).

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

In that Marketplace contract there are several stores and items, so you should be able to interact with it as a normal buyer (any valid account in Rinkeby). **If you want to create a Seller or an Admin user, [contact me](https://github.com/chechu) and I'll add you to the contract with these roles**.

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

## Integrations

### Uport

The user can perform login and signing of transactions with the Uport mobile application. The integration is unsecured, not ready for production environments, because the keypair with private information of the distribute entity to interact with is stored in a [public file on the repository]((./blob/master/src/util/connectors.js#L21)). This keypair should be managed in a server.

To login with Uport, click on the "Login with Uport" link, at top right corner in the homepage. A QR code will be shown to you, and you should scan it with the Uport mobile app ([Android](https://play.google.com/store/apps/details?id=com.uportMobile&hl=en), [IPhone](https://itunes.apple.com/us/app/uport-id/id1123434510?mt=8)).

![Login with Uport](/doc/images/uport.png)

After scanning your QR code, the mobile application will ask you for logining in the application with an associated ETH account. You can create a new one in that moment.

![Uport mobile](/doc/images/uport_mobile.png)

A successful login process will store data in your local storage, so following logins won't ask you for scanning any QR code. You will only have to accept the login in your mobile. From now on, every time you need to sign a transaction the Uport mobile application warn you to accept it.

### Oraclize

The integration with Oraclize is just a proof of concept. We are deploying the contract KrakenPriceTicker, that has the following relevant parts:

* Method `update()`. It makes a request to another Oraclize contract, asking it for an update on the exchange ratio that we want.
* Method `__callback()`. Executed by Oraclize on our contract, providing the updated value that we requested previously.
* Public variable `priceETHUSD`. Where we store the update value received in `__callback()`.

Our web application requests this `priceETHUSD` value, and it's subscribed to change on it via Ethereum events. The application shows in the footer the updated value, and it uses it during the checkout process to give an estimation of how much will cost the purchase in USD.

To update the value of `priceETHUSD`, an external call should be done to the method `updated`. An alternative could be to invoke this method on the `__callback` method, to keep a continous loop of updating.

**Note:** This integration is only running when our contracts are deployed in Rinkeby, because of the interaction with the Oraclize contracts.

### ENS

There are two use cases where you could need to add an ETH address: adding a new admin and adding a new seller. In both cases, instead of an ETH address, you can use a valid ENS name. Internally the web application will resolve this name to an ETH address, that will be used under the hood.

**Note:** This integration is only running when our contracts are deployed in Rinkeby, because of the interaction with the ENS contracts.

### Open Zeppelin

I've reused two artifacts from the Open Zeppelin project:

* [Ownable contract](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/ownership/Ownable.sol), to manage the ownership of the contract, and who can do actions reserved to the owner ot it.
* [Safe Math library](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol), to perform safe maths operations.

# Final notes

* The homepage image is from https://www.astroprint.com/es/products/p/3d-printing-app-marketplace
* I've used [uiGradients](https://uigradients.com) to create the backgound.
* Relevant links for Uport:
  * https://medium.com/uport/a-complete-list-of-uports-protocols-libraries-and-solutions-63e9b99b9fd6
  * https://hackernoon.com/uport-transactions-d5b171f7068f
  * https://disect.diwala.io/
  * https://github.com/uport-project/uport-connect/blob/db4e1b83cf49a9925995e8e938f00cf71919c237/examples/integration-tutorial/index.js
  * https://github.com/uport-project/uport-connect
  * https://developer.uport.me/credentials/login
  * https://developer.uport.me/uport-connect/reference/index
  * https://medium.com/uport/different-approaches-to-ethereum-identity-standards-a09488347c87
  * https://github.com/uport-project/demo/blob/master/src/components/SignTransaction.js
  * https://medium.com/@uPort/ethdenver-uport-hackathon-projects-fd98d9ff0419
* Other relevant links:
  * [Ethereum Natural Specification Format](https://github.com/ethereum/wiki/wiki/Ethereum-Natural-Specification-Format)
