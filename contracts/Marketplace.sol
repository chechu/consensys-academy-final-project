pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import { SafeMath } from 'openzeppelin-solidity/contracts/math/SafeMath.sol';

/**
 * @title Marketplace contract to sell, buy and withdraw funds
 * @author Jesús Lanchas
 * @notice This contract belongs to a final project in the Developer Program 2018 @ Consensys Academy
 * @dev All outcome values in transaction methods are included in events
 */
contract Marketplace is Ownable {

    enum Roles { ADMIN, SELLER, BUYER }

    // Circuit breaker
    bool public stopped = false;

    // Limit to avoid out of gas issue iterating on items
    uint8 public constant MAX_ITEMS_PER_STORE = 10;

    // To know the role of a specific user
    mapping(address => Roles) roles;
    mapping(address => bool) privilegedUsers;

    // Stores owned by sellers
    mapping(address => Empire) empires;
    address[] sellers;

    // Payments
    mapping (address => uint) pendingFunds;

    // Structs
    struct Empire {
        mapping(bytes32 => Store) stores;
        bytes32[] storesIds;
    }

    struct Store {
        bytes32 storeId;
        address seller;
        string name;
        mapping(uint => Item) items;
        uint[] skus;
    }

    struct Item {
        uint sku;
        uint skuIndex; // position of this item in the array store.items
        string name;
        uint price;
        uint availableNumItems;
    }

    // Management events
    event SellerAdded(address newSeller);
    event SellerRemoved(address oldSeller);
    event AdminAdded(address newAdmin);
    event AdminRemoved(address oldAdmin);

    // Business events
    event StoreCreated(address seller, string name, bytes32 storeId);
    event StoreRemoved(address seller, bytes32 storeId);
    event ItemCreated(address seller, bytes32 storeId, uint sku, string name, uint price, uint availableNumItems);
    event ItemRemoved(address seller, bytes32 storeId, uint sku);
    event ItemEdited(address seller, bytes32 storeId, uint sku, string name, uint price, uint availableNumItems);
    event ItemPurchased(address seller, bytes32 storeId, uint sku, uint numPurchasedItems, uint newAvailableNumItems);

    /* Roles modifiers */
    /**
     * @notice Require the address `msg.sender` to be a valid admin in the contract.
     */
    modifier isAdmin () { require (privilegedUsers[msg.sender] && roles[msg.sender] == Roles.ADMIN, 'User must have the ADMIN role'); _;}

    /**
     * @notice Require the addres `msg.sender` to be a valid seller in the contract.
     */
    modifier isSeller () { require (privilegedUsers[msg.sender] && roles[msg.sender] == Roles.SELLER, 'User must have the SELLER role'); _;}

    /**
     * @notice Require the address `_address` to be a buyer.
     * @dev An address is considered a buyer is it is not an admin neither a seller.
     */
    modifier isBuyer (address _address) { require (!privilegedUsers[_address], 'User must be a buyer'); _;}

    // Ownership modifiers
    /**
     * @notice Require the address `msg.sender` to be the owner of the store whose id is `storeId`
     */
    modifier isSellerOwner (bytes32 storeId) { require(empires[msg.sender].stores[storeId].storeId != 0, 'User must be the owner of the store'); _; }

    /**
     * Require the address `msg.sender` to be the owner of the store whose id is `storeId` and where the item with sku `sku` is been sold
     */
    modifier isItemSeller (bytes32 storeId, uint sku) {
        require (
            empires[msg.sender].stores[storeId].storeId != 0
            && empires[msg.sender].stores[storeId].items[sku].sku != 0, 'User must be the owner of store where the item is sold');
        _;
    }

    // Circuit breaker
    /**
     * Require the contrat not to be in emergency
     */
    modifier stopInEmergency { require(!stopped, 'Contract in emergency mode'); _; }
    /**
     * @notice Toggle the emergency state of the contract. Only the owner can do this
     */
    function toggleContractActive() public onlyOwner {
        stopped = !stopped;
    }

    /* Managing permissions */

    /**
     * @notice Getting the current role of the sender in the contract
     * @return The enum value of Roles associated with the sender of the message
     * @dev A no privileged user is considered a buyer. Owner is not a role in the contract
     */
    function getRole() public view returns(Roles) {
        return privilegedUsers[msg.sender] ? roles[msg.sender] : Roles.BUYER;
    }

    /**
     * @notice Add the address `newAdmin` in the list of admins
     * @param newAdmin The address that we want to include as Admin in the contract
     * @dev Event emitted on success: AdminAdded
     */
    function addAdmin(address newAdmin) public stopInEmergency onlyOwner {
        roles[newAdmin] = Roles.ADMIN;
        privilegedUsers[newAdmin] = true;
        emit AdminAdded(newAdmin);
    }

    /**
     * @notice Remove the addres `oldAdmin` from the list of valid admins
     * @param oldAdmin The address that we want to remove from the list of admins
     * @dev Event emitted: AdminRemoved
     */
    function removeAdmin(address oldAdmin) public stopInEmergency onlyOwner {
        delete roles[oldAdmin];
        delete privilegedUsers[oldAdmin];
        emit AdminRemoved(oldAdmin);
    }

    /**
     * @notice Add the address `newAddress` to the list of valid sellers
     * @param newSeller The address that we want to add as seller
     * @dev Event emitted: SellerAdded
     */
    function addSeller(address newSeller) public stopInEmergency isAdmin isBuyer(newSeller) {
        roles[newSeller] = Roles.SELLER;
        privilegedUsers[newSeller] = true;
        sellers.push(newSeller);
        emit SellerAdded(newSeller);
    }

    /**
     * @notice Remove the seller set at index `sellerIndex` as seller in the contract, transforming it into a buyer. The pending funds will be kept.
     * @dev This operation changes the order in the sellers array. Event emitted: SellerRemoved
     * @param sellerIndex The index of the seller in the array of sellers, of the seller that we want to remove
     */
    function removeSeller(uint sellerIndex) public stopInEmergency isAdmin {
        // Soft control, we don't require the existance of the seller...
        require(sellerIndex >= 0 && sellerIndex < sellers.length, 'Seller index is out of bound');
        address sellerAddress = sellers[sellerIndex];

        // Soft control, we don't require the existance of the seller...
        if (privilegedUsers[sellerAddress] && roles[sellerAddress] == Roles.SELLER) {
            // Delete from the maps
            delete roles[sellerAddress];
            delete privilegedUsers[sellerAddress];

            // Delete from array
            // Removing and compacting an item in an array: https://github.com/su-squares/ethereum-contract/blob/master/contracts/SuNFT.sol#L296
            if (sellers.length > 1 && sellerIndex != sellers.length - 1)        {
                sellers[sellerIndex] = sellers[sellers.length - 1];
            }
            sellers.length--;

            emit SellerRemoved(sellerAddress);
        }
    }

    /**
     * @notice Return the number of sellers in the contract
     * @dev It's based on the array of sellers, not in the pending funds
     * @return The number of sellers in the contract
     */
    function getNumberOfSellers() public view returns(uint) {
        return sellers.length;
    }

    /**
     * @notice Return the address of seller set in the position `sellerIndex`
     * @param sellerIndex The index of the seller whose address we want to get
     * @return The seller address in position sellerIndex
     */
    function getSellerAddress(uint sellerIndex) public view returns(address) {
        require(sellerIndex >= 0 && sellerIndex < sellers.length, 'Out of bound index');
        return sellers[sellerIndex];
    }

    /* Managing stores */

    /**
     * @notice Add a new store associated to the addres `msg.sender`, with name `name`
     * @dev The storeId is generated internally with keccak256. Event emitted: StoreCreated
     * @param name The name to set to the created store
     */
    function addStore(string memory name) public stopInEmergency isSeller  {
        require(bytes(name).length > 0, 'The name of the store must not be empty');

        bytes32 storeId = keccak256(abi.encodePacked(msg.sender, name));
        require(empires[msg.sender].stores[storeId].storeId == 0, 'The seller must not have two stores with the same name');

        Empire storage empire = empires[msg.sender];
        empire.stores[storeId] = Store({ storeId: storeId, seller: msg.sender, name: name, skus: new uint[](0) });
        empire.storesIds.push(storeId);

        emit StoreCreated(msg.sender, name, storeId);
    }

    /**
     * @notice Remove the store with storeId `storeId`, set in position `storeIndex`.
     * @dev empire.storesIds[storeIndex] must be equals to storeId. The only reason to accept the two params is efficiency.
     * @dev Store's items are deleted in a for-loop, so if the number of items is too high this could be an issue. For that reason we limit the number of items in a store to `MAX_ITEMS_PER_STORE`
     * @param storeId The id of the store to remove
     * @param storeIndex The index of the store, in the array of stores, that we want to remove
     */
    function removeStore(bytes32 storeId, uint storeIndex) public stopInEmergency isSeller isSellerOwner(storeId) {
        // TODO - Taking into account this: https://solidity.readthedocs.io/en/develop/types.html#delete
        Empire storage empire = empires[msg.sender];
        Store storage store = empires[msg.sender].stores[storeId];

        require(empire.storesIds[storeIndex] == storeId, 'The storeId provided is not coherent with the store index passed');

        // Removing items associated with the store - This could generate a gas problem if the number of items is too high
        for(uint skuIndex = 0; skuIndex < store.skus.length; skuIndex++) {
            delete store.items[store.skus[skuIndex]];
        }

        // Removing the store
        delete empire.stores[storeId];

        // Removing and compacting an item in an array: https://github.com/su-squares/ethereum-contract/blob/master/contracts/SuNFT.sol#L296
        if (empire.storesIds.length > 1 && storeIndex != empire.storesIds.length - 1)        {
            empire.storesIds[storeIndex] = empire.storesIds[empire.storesIds.length - 1];
        }
        delete empire.storesIds[empire.storesIds.length - 1];
        empire.storesIds.length--;

        emit StoreRemoved(msg.sender, storeId);
    }

    /**
     * @notice Return the number of stores associated with the address `seller`
     * @param seller The address whose number of stores we want to get
     * @return The number of stores of the seller passed as parameter
     */
    function getNumberOfStores(address seller) public view returns(uint) {
        Empire storage empire = empires[seller];
        return empire.storesIds.length;
    }

    /**
     * @notice Return the storeId of the store of `seller` set in position `storeIndex`
     * @param seller The address of the store's owner whose id we want to get
     * @param storeIndex The index of the store, among the stores of the owner, whose storeId we want to get
     */
    function getStoreId(address seller, uint storeIndex) public view returns(bytes32) {
        return empires[seller].storesIds[storeIndex];
    }

    /**
     * @notice Returns the name of the store and the number of items in it
     * @param seller The address of the store's owner whose metadata we want to get
     * @param storeId The store id of te store whose metadata we want to get
     */
    function getStoreMetadata(address seller, bytes32 storeId) public view returns(string memory, uint) {
        Store storage store = empires[seller].stores[storeId];
        return (store.name, store.skus.length);
    }

    /* Managing items */

    /**
     * @notice Create and add a new item in the store whose storeId is passed as parameter
     * @param storeId The store id where we want to add a new item
     * @param sku The SKU of the item to create. Important: this field is not editable
     * @param name The name of the item to create
     * @param price The unitary price of the item to create
     * @param availableNumItems The number of items available to sell
     * @dev Event emitted: ItemCreated
     */
    function addItem(bytes32 storeId, uint sku, string memory name, uint price, uint availableNumItems)
        public
        stopInEmergency
        isSeller
        isSellerOwner(storeId) {
        Store storage store = empires[msg.sender].stores[storeId];

        require(store.skus.length <= MAX_ITEMS_PER_STORE, 'You have reach the max number of items per store');

        // Checking that there aren't any item with the same sku in the store
        require(store.items[sku].sku == 0, 'SKU must be unique for a store');

        require(price > 0, 'Price must be a positive number');
        require(availableNumItems >= 0, 'Available items must be a positive number or zero');

        store.items[sku] = Item({ sku: sku, skuIndex: store.skus.length, name: name, price: price, availableNumItems: availableNumItems });
        store.skus.push(sku);

        emit ItemCreated(msg.sender, store.storeId, sku, name, price, availableNumItems);
    }

    /**
     * @notice Update the item in the store with storeId `storeId` and whose sku is `sku`
     * @param storeId The storeId where the item to update is located
     * @param sku The sku of the item to update
     * @param name The new name to set in the item
     * @param price The new price to set in the item
     * @param availableNumItems The new available amount to set in the item
     * @dev Event emitted: ItemEdited
     */
    function editItem(bytes32 storeId, uint sku, string memory name, uint price, uint availableNumItems)
        public
        stopInEmergency
        isSeller
        isItemSeller(storeId, sku) {
        Store storage store = empires[msg.sender].stores[storeId];

        // TODO Check integer overflows (more in the buy operation)
        require(price > 0, 'Price must be a positive number');
        require(availableNumItems >= 0, 'Available items must be a positive number or zero');

        store.items[sku] = Item({ sku: sku, skuIndex: store.items[sku].skuIndex, name: name, price: price, availableNumItems: availableNumItems });

        emit ItemEdited(msg.sender, store.storeId, sku, name, price, availableNumItems);
    }

    /**
     * @notice Return the number of items from the seller `seller` in the store `storeId`
     * @param seller The address of the seller to consider
     * @param storeId The id of the store to consider
     * @return The number of items in the store
     * @dev It will return zero if the seller or the store don't exist
     */
    function getNumberOfItems(address seller, bytes32 storeId) public view returns(uint) {
        Empire storage empire = empires[seller];
        return empire.stores[storeId].skus.length;
    }

    /**
     * @notice Return the SKU of the item set in the position `skuIndex`, in the store with id `storeId` of the seller `seller`
     * @param seller The seller of the item
     * @param storeId The id of the store where the item is located
     * @param skuIndex The position of the item in the array of items associated with the store
     * @return The SKU of the item
     * @dev It'll return zero if the item, the store, or the seller don't exist
     */
    function getSku(address seller, bytes32 storeId, uint skuIndex) public view returns(uint) {
        return empires[seller].stores[storeId].skus[skuIndex];
    }

    /**
     * @notice Return the metadata associated with the sku `sku`, in the store `storeId`, of the seller `seller`
     * @param seller The owner of the item whose metadata we want to get
     * @param storeId The id of the store were the item is located
     * @param sku The sku of the item whose metadata we want to get
     * @return The name, price and availableNumItems attributes of the item
     * @dev The return values will have default values if the item, the store or the seller don't exist
     */
    function getItemMetadata(address seller, bytes32 storeId, uint sku)
        public
        view
        returns(string memory, uint, uint) {
        Item storage item = empires[seller].stores[storeId].items[sku];
        return (item.name, item.price, item.availableNumItems);
    }

    /**
     * @notice Remove the item with sku `sku` from a store with id `storeId`
     * @param storeId The id of the store where the item to remove is located
     * @param sku The sku of the item to remove
     * @dev Event emitted: ItemRemoved
     */
    function removeItem(bytes32 storeId, uint sku)
        public
        stopInEmergency
        isSeller
        isItemSeller(storeId, sku) {

        Store storage store = empires[msg.sender].stores[storeId];
        uint skuIndex = store.items[sku].skuIndex;

        require(skuIndex < store.skus.length, 'SKU not found in item list');

        // Delete from map
        delete store.items[sku];

        // Delete from array
        // Removing and compacting an item in an array: https://github.com/su-squares/ethereum-contract/blob/master/contracts/SuNFT.sol#L296
        if (store.skus.length > 1 && skuIndex != store.skus.length - 1)        {
            store.skus[skuIndex] = store.skus[store.skus.length - 1];
            store.items[store.skus[skuIndex]].skuIndex = skuIndex; // Updating the double link
        }

        // delete store.skus[store.skus.length - 1];
        store.skus.length--;

        emit ItemRemoved(msg.sender, storeId, sku);
    }

    /**
     * @notice Purchase `numPurchasedItems` items with sku `sku`, in the store with id `storeId`, of the seller `seller`. It expects the exact value.
     * @param seller The owner of the item to purchase
     * @param storeId The id of the store where the item is located
     * @param sku The sku of the item to purchase
     * @param numPurchasedItems The number of items to purchase. It must be greater than the available number of items
     * @dev msg.value must be exactly equals to item.price * numPurchasedItems. The funds will be avaiable to the seller (Withdrawal pattern)
     */
    function purchaseItem(address seller, bytes32 storeId, uint sku, uint numPurchasedItems)
        public
        payable
        stopInEmergency
        isBuyer(msg.sender) {
        Store storage store = empires[seller].stores[storeId];

        // The item must exist
        require (store.storeId != 0, 'Store must exist');
        require (store.items[sku].sku != 0, 'Item must be in the store');

        Item storage item = store.items[sku];
        // There must be enough number of items, and at least 1
        require (numPurchasedItems > 0 && item.availableNumItems >= numPurchasedItems, 'Invalid number of items to purchase');

        // Sent value must be, exactly, equals to the price * numPurchasedItems
        require (msg.value == item.price * numPurchasedItems, 'Invalid value in the message');

        // Updating the storage
        item.availableNumItems -= numPurchasedItems;
        pendingFunds[seller] = SafeMath.add(pendingFunds[seller], msg.value);

        emit ItemPurchased(seller, store.storeId, item.sku, numPurchasedItems, item.availableNumItems);
    }

    /**
     * @notice Withdraw funds from the contract to `msg.sender`, considering the pending funds saved in the contact
     * @dev Nothing is executed after transfer the value, to avoid reentrancy
     */
    function withdraw() public isSeller {
        uint amount = pendingFunds[msg.sender];
        pendingFunds[msg.sender] = 0;
        msg.sender.transfer(amount);
    }

    /**
     * @notice Return the value of pending funds associated with `msg.sender`
     * @dev Only sellers can do this
     * @return the value, in wei, pending for the sender
     */
    function getPendingFunds() public view isSeller returns(uint) {
        return pendingFunds[msg.sender];
    }
}
