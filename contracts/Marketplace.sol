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
  event AdminAdded(address newAdmin);

  event StoreCreated(address seller, string name, bytes32 storeId);

  /* Roles modifiers */
  modifier isAdmin () { require (privilegedUsers[msg.sender] && roles[msg.sender] == Roles.ADMIN); _;}
  modifier isSeller () { require (privilegedUsers[msg.sender] && roles[msg.sender] == Roles.SELLER); _;}
  modifier isBuyer (address _address) { require (!privilegedUsers[_address]); _;}

  /* Ownership modifiers */
  modifier isSellerOwner (bytes32 storeId) { require(true); /* (empires[msg.sender].stores[storeId]); */_; }
  modifier isItemSeller (bytes32 storeId, uint sku) {
    // require (empires[msg.sender].stores[storeId]);
    // require (empires[msg.sender].stores[storeId].items[sku]);
    _;
  }

  function getRole() public view returns(Roles) {
    return privilegedUsers[msg.sender] ? roles[msg.sender] : Roles.BUYER;
  }

  function addAdmin(address newAdmin) public onlyOwner {
    roles[newAdmin] = Roles.ADMIN;
    privilegedUsers[newAdmin] = true;
    emit AdminAdded(newAdmin);
  }

  function addSeller(address newSeller) public isAdmin() isBuyer(newSeller) {
    roles[newSeller] = Roles.SELLER;
    privilegedUsers[newSeller] = true;
    emit SellerAdded(newSeller);
  }

  /* Managing stores */

  function addStore(bytes32 name) public isSeller() returns(bytes32) {
    // TODO Check that "name" is not empty

    bytes32 storeId = keccak256(abi.encodePacked(msg.sender, name));
    require(bytes(empires[msg.sender].stores[storeId].storeId).length == 0);

    Empire storage empire = empires[msg.sender];
    empire.stores[storeId] = Store({ storeId: storeId, seller: msg.sender, name: name, skus: new uint[](0) });
    empire.storesIds.push(storeId);

    emit StoreCreated(msg.sender, name, storeId);

    return storeId;
  }

  function removeStore(bytes32 storeId) public isSeller() isSellerOwner(storeId) {
    // TODO - Taking into account this: https://solidity.readthedocs.io/en/develop/types.html#delete
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
    isSeller()
    isSellerOwner(storeId) {
    Store storage store = empires[msg.sender].stores[storeId];

    // Checking that there aren't any item with the same sku in the store
    require(store.items[sku].sku == 0);

    // TODO Check integer overflows (more in the buy operation)
    require(price > 0 && availableAmount > 0);
    store.items[sku] = Item({ sku: sku, name: name, price: price, availableAmount: availableAmount });

    store.skus.push(sku);
  }

  function getSku(address seller, bytes32 storeId, uint skuIndex) public view returns(uint) {
    Store storage store = empires[seller].stores[storeId];
    return store.skus[skuIndex];
  }

  function getItemMetadata(address seller, bytes32 storeId, uint sku)
    public
    view
    returns(string memory, uint, uint) {
    Item storage item = empires[seller].stores[storeId].items[sku];
    return (item.name, item.price, item.availableAmount);
  }
}
