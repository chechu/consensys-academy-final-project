# Avoiding common attacks

## Reentrancy

I've implemented the Checks-Effects-Interactions pattern, as I explain [here](design_pattern_desicions)

### Gas limit and loops
Removing a store (method implemented in the contract but not in the web application), could generate a gas issue. To delete a store, the contract iterates on the associated items, removing it. If the number of items associated with the store would be too high, we could have a gas limit issue.

One solution could be to perform a logical remove, keeping the store in the contract's storage, but with a flag to ignore it form now on.

A better solution is to store the index in the store struct, and update it when the array is modified.


avoiding_common_attacks.md
