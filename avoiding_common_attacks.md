# Avoiding common attacks

## Reentrancy

I've implemented the Checks-Effects-Interactions pattern, as I explain [here](/design_pattern_desicions.md). The most importan method related with this attack is `withdraw`, where the transfer is done at the end.

## Integer Overflow and Underflow

I've used the library [Safe Math](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol) to avoid this attack. In other cases I've included checks on parameters to take care on it.

## DoS with Block Gas Limit

### Gas limit and loops

I've avoided `while` loops, to avoid this kind of attacks. To avoid `while` loops I had to add some extra data in the contract structs. For instance, `Item` has a `skuIndex` field with the index of that item in another data structure. With this data redundancy I can avoid to iterate on that structure.

A store has a set of items. When I want to remove a store, the contract iterate on the items, removing them to free storage space. If the number of items in the store is too high, we can find an out of gas issue. To avoid this problem I've limited the max number of items in a store using the constant `MAX_ITEMS_PER_STORE` and a require statement in the `addItem` method.
