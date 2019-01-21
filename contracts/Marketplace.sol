pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract Marketplace is Ownable {

    enum Roles { ADMIN, SELLER, BUYER }

    /* To know the role of a specific user */
    mapping(address => Roles) roles;
    mapping(address => bool) privilegedUsers;

    /* Stores owned by sellers */
    mapping(address => Empire) empires;

    /* Structs */
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
        string name;
        uint price;
        uint availableAmount;
    }

    /* Events */
    event SellerAdded(address newSeller);
    event SellerRemoved(address oldSeller);
    event AdminAdded(address newAdmin);
    event AdminRemoved(address oldAdmin);

    event StoreCreated(address seller, string name, bytes32 storeId);
    event StoreRemoved(address seller, bytes32 storeId);
    event ItemCreated(address seller, bytes32 storeId, uint sku, string name, uint price, uint availableAmount);
    event ItemRemoved(address seller, bytes32 storeId, uint sku);
    event ItemEdited(address seller, bytes32 storeId, uint sku, string name, uint price, uint availableAmount);

    /* Roles modifiers */
    modifier isAdmin () { require (privilegedUsers[msg.sender] && roles[msg.sender] == Roles.ADMIN); _;}
    modifier isSeller () { require (privilegedUsers[msg.sender] && roles[msg.sender] == Roles.SELLER); _;}
    modifier isBuyer (address _address) { require (!privilegedUsers[_address]); _;}

    /* Ownership modifiers */
    modifier isSellerOwner (bytes32 storeId) { require(empires[msg.sender].stores[storeId].storeId != 0); _; }
    modifier isItemSeller (bytes32 storeId, uint sku) {
        require (empires[msg.sender].stores[storeId].storeId != 0);
        require (empires[msg.sender].stores[storeId].items[sku].sku != 0);
        _;
    }

    /* Managing permissions */

    function getRole() public view returns(Roles) {
        return privilegedUsers[msg.sender] ? roles[msg.sender] : Roles.BUYER;
    }

    function addAdmin(address newAdmin) public onlyOwner {
        roles[newAdmin] = Roles.ADMIN;
        privilegedUsers[newAdmin] = true;
        emit AdminAdded(newAdmin);
    }

    function removeAdmin(address oldAdmin) public onlyOwner {
        delete roles[oldAdmin];
        delete privilegedUsers[oldAdmin];
        emit AdminRemoved(oldAdmin);
    }

    function addSeller(address newSeller) public isAdmin isBuyer(newSeller) {
        roles[newSeller] = Roles.SELLER;
        privilegedUsers[newSeller] = true;
        emit SellerAdded(newSeller);
    }

    function removeSeller(address oldSeller) public isAdmin {
        delete roles[oldSeller];
        delete privilegedUsers[oldSeller];
        emit SellerRemoved(oldSeller);
    }

    /* Managing stores */

    function addStore(string memory name) public isSeller {
        require(bytes(name).length > 0, 'The name of the store cannot be empty');

        bytes32 storeId = keccak256(abi.encodePacked(msg.sender, name));
        require(empires[msg.sender].stores[storeId].storeId == 0, 'The seller must not have two stores with the same name');

        Empire storage empire = empires[msg.sender];
        empire.stores[storeId] = Store({ storeId: storeId, seller: msg.sender, name: name, skus: new uint[](0) });
        empire.storesIds.push(storeId);

        emit StoreCreated(msg.sender, name, storeId);
    }

    function removeStore(bytes32 storeId, uint storeIndex) public isSeller isSellerOwner(storeId) {
        // TODO - Taking into account this: https://solidity.readthedocs.io/en/develop/types.html#delete
        Empire storage empire = empires[msg.sender];
        Store storage store = empires[msg.sender].stores[storeId];

        // Removing items associated with the store
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

    function getNumberOfStores(address seller) public view returns(uint) {
        Empire storage empire = empires[seller];
        return empire.storesIds.length;
    }

    function getStoreId(address seller, uint storeIndex) public view returns(bytes32) {
        return empires[seller].storesIds[storeIndex];
    }

    /*
     * returns the name of the store and the number of items in it
     */
    function getStoreMetadata(address seller, bytes32 storeId) public view returns(string memory, uint) {
        Store storage store = empires[seller].stores[storeId];
        return (store.name, store.skus.length);
    }

    /* Managing items */

    function addItem(bytes32 storeId, uint sku, string memory name, uint price, uint availableAmount)
        public
        isSeller
        isSellerOwner(storeId) {
        Store storage store = empires[msg.sender].stores[storeId];

        // Checking that there aren't any item with the same sku in the store
        require(store.items[sku].sku == 0, 'SKU must be unique for a store');

        // TODO Check integer overflows (more in the buy operation)
        require(price > 0, 'Price must be a positive number');
        require(availableAmount > 0, 'Available amount must be a positive number');

        store.items[sku] = Item({ sku: sku, name: name, price: price, availableAmount: availableAmount });
        store.skus.push(sku);

        emit ItemCreated(msg.sender, store.storeId, sku, name, price, availableAmount);
    }

    function editItem(bytes32 storeId, uint sku, string memory name, uint price, uint availableAmount)
        public
        isSeller
        isItemSeller(storeId, sku) {
        Store storage store = empires[msg.sender].stores[storeId];

        // TODO Check integer overflows (more in the buy operation)
        require(price > 0, 'Price must be a positive number');
        require(availableAmount > 0, 'Available amount must be a positive number');

        store.items[sku] = Item({ sku: sku, name: name, price: price, availableAmount: availableAmount });

        emit ItemEdited(msg.sender, store.storeId, sku, name, price, availableAmount);
    }

    function getNumberOfItems(address seller, bytes32 storeId) public view returns(uint) {
        Empire storage empire = empires[seller];
        return empire.stores[storeId].skus.length;
    }

    function getSku(address seller, bytes32 storeId, uint skuIndex) public view returns(uint) {
        return empires[seller].stores[storeId].skus[skuIndex];
    }

    function getItemMetadata(address seller, bytes32 storeId, uint sku)
        public
        view
        returns(string memory, uint, uint) {
        Item storage item = empires[seller].stores[storeId].items[sku];
        return (item.name, item.price, item.availableAmount);
    }

    function removeItem(bytes32 storeId, uint sku)
        public
        isSeller
        isItemSeller(storeId, sku) {

        Store storage store = empires[msg.sender].stores[storeId];
        uint skuIndex = 0;

        while(skuIndex < store.skus.length && store.skus[skuIndex] != sku) {
            skuIndex++;
        }

        require(skuIndex < store.skus.length, 'sku not found in item list');

        // Delete from map
        delete store.items[sku];

        // Delete from array
        // Removing and compacting an item in an array: https://github.com/su-squares/ethereum-contract/blob/master/contracts/SuNFT.sol#L296
        if (store.skus.length > 1 && skuIndex != store.skus.length - 1)        {
            store.skus[skuIndex] = store.skus[store.skus.length - 1];
        }

        // delete store.skus[store.skus.length - 1];
        store.skus.length--;

        emit ItemRemoved(msg.sender, storeId, sku);
    }
}
