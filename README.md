# consensys-academy-final-project
ConsenSys Academy’s 2018 Developer Program Final Project

I'm using Uport Connect to make a simple (not production ready) integration with Uport, where the requests are signed in the Browser Application with a temporary (stored in the local storage) private key (for more info see https://developer.uport.me/uport-connect/reference/index#Connect+sendVerification)

## How did I remove an item from an indexed and unsorted array
Moving the last item of the array on the position of the item that I want to remove, and decrementing the length of the array. Inspired in https://github.com/su-squares/ethereum-contract/blob/master/contracts/SuNFT.sol#L296.

According to this: https://ethereum.stackexchange.com/a/39302 You don't need to delete explicitly using `delete array[index]`. It's enough with `array.length--`.

## Circuit breaker
The flag `stopped` is public, to allow to know if the contract is stopped or not from outside.

# Relevant links

[Ethereum Natural Specification Format](https://github.com/ethereum/wiki/wiki/Ethereum-Natural-Specification-Format)

## Stylesheets
https://uigradients.com

## Links for Uport
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
