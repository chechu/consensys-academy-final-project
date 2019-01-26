# Design pattern desicions

## Circuit breaker

I've added a circuit breaker in the contract, configurable only by the owner of the contract. In emergency mode the contract will allow only read operations and the withdrawal of funds. This control is done via the modifier `stopInEmergency`.

The modifier _require_ that the contract is not in emergency mode. Therefore, a pre readonly call to the method, without wasting gas, can alert us if the future invocation would be done successfully.

The flag `stopped` is public, to allow us to know if the contract is stopped or not from outside the contract (from the Web application, for instance, to show the proper interface to the user).

## Withdrawal

The purchasing operation doesn't include a transfer of value to the seller. The value is added to the map `pendingFundings`, so the seller must request for these funds in an independent operation. The goal is to avoid re-entrancy attacks.

## Restricting access, with roles and ownership

This is another [typical pattern](https://solidity.readthedocs.io/en/v0.5.3/common-patterns.html#restricting-access). The ownership control is done reusing the [Ownable](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/ownership/Ownable.sol) contract provided by OpenZeppelin. The role control is implemented in the contract, with the maps `roles` and `privilegedUsers`, and several modifiers applyed on every method.


## Checks-Effects-Interactions pattern

In general I've take this pattern into my consideration for every method, applying first modifiers, doing some extra checks in the beginning of the method, changing then the store variables and executing interactions with other contracts at the end.

The most relevant case is the `withdraw` method, where `transfer` is the last operation to execute. The goal is to avoid re-entrancy attacks.
