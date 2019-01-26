# Avoiding common attacks

## Reentrancy

I've implemented the [Checks-Effects-Interactions](https://solidity.readthedocs.io/en/develop/security-considerations.html?highlight=check%20effects#use-the-checks-effects-interactions-pattern) pattern, as I've explained [here](/design_pattern_desicions.md). The most important method related with this attack is `withdraw`, where the transfer (that can imply an invokation on untrusted contract) is done at the end, after the state modifications.

## Integer Overflow and Underflow

I've used the library [Safe Math](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol), as a _demostration of integration with an external library_, to avoid this attack. The use case is really useless because I'm adding two values in wei stored in `uint256` variables, so the overflow will never be able to happen.

In other cases I've included checks on parameters to take care on this kind of attack. For instance, in the `purchase` method I require the number of items to buy to be bigger than zero (to avoid the overflow updating the remaining number of items), and equal or smaller than the number of available items (to avoid the underflow on updating).

## DoS with Block Gas Limit - Loops

I've avoided `while` loops, to avoid this kind of attacks. To avoid `while` loops I had to add some extra data in the contract structs. For instance, `Item` has a `skuIndex` field with the index of that item in another data structure. With this data redundancy I can avoid to iterate on that structure.

A store has a set of items. When I want to remove a store, the contract iterate on the items, removing them to free storage space. If the number of items in the store is too high, we can find an out of gas issue. To avoid this problem I've limited the max number of items in a store using the constant `MAX_ITEMS_PER_STORE` and a require statement in the `addItem` method.
