import { getWeb3, DEFAULT_GAS_PRICE } from '../connectors'

const abi = require('./abi/Marketplace.json').abi;
export const CONTRACT_ADDRESS = '0x36b7079326f56C0067444813A5994841fB68f446';

export let contract;

export function initContract(from) {
    const web3 = getWeb3();
    contract = contract || new web3.eth.Contract(abi, CONTRACT_ADDRESS, { from, gasPrice: DEFAULT_GAS_PRICE });
}

export const ROLES = {
    OWNER: '-1',
    ADMIN: '0',
    SELLER: '1',
    BUYER: '2',
};

export function getNumberOfStores(sellerAddress) {
    return contract.methods.getNumberOfStores(sellerAddress).call();
}

export async function getStoreIds(sellerAddress) {
    const promises = [];
    const numberOfStores = await getNumberOfStores(sellerAddress);
    for(let i = 0; i < numberOfStores; i++) {
        promises.push(contract.methods.getStoreId(sellerAddress, i).call());
    }
    return Promise.all(promises);
}

export async function getStoreMetadata(sellerAddress, storeId) {
    const storeMetadata = await contract.methods.getStoreMetadata(sellerAddress, storeId).call();
    return { name: storeMetadata[0], numItems: storeMetadata[1], items:[], storeId, sellerAddress };
}

export async function getStoresMetadataBySeller(sellerAddress) {
    const storeIds = await getStoreIds(sellerAddress);
    return Promise.all(storeIds.map(storeId => getStoreMetadata(sellerAddress, storeId)));
}

export async function getStoresMetadataBySellers(sellerAddresses) {
    const metadatas = await Promise.all(sellerAddresses.map(sellerAddress =>
        getStoresMetadataBySeller(sellerAddress).then(metadatas => ({ [sellerAddress]: metadatas }))
    ));
    return metadatas.reduce((acc, current) => ({ ...acc, ...current }), {})
}

export function getNumberOfItems(sellerAddress, storeId) {
    return contract.methods.getNumberOfItems(sellerAddress, storeId).call();
}

export async function getSkus(sellerAddress, storeId) {
    const promises = [];
    const numberOfItems = await getNumberOfItems(sellerAddress, storeId);
    for(let i = 0; i < numberOfItems; i++) {
        promises.push(contract.methods.getSku(sellerAddress, storeId, i).call());
    }
    return Promise.all(promises);
}

export async function getItemMetadata(sellerAddress, storeId, sku) {
    const itemMetadata = await contract.methods.getItemMetadata(sellerAddress, storeId, sku).call();
    return { name: itemMetadata[0], price: itemMetadata[1], availableNumItems: itemMetadata[2], sku, sellerAddress, storeId };
}

export async function getItemsMetadata(sellerAddress, storeId) {
    const skus = await getSkus(sellerAddress, storeId);
    return Promise.all(skus.map(sku => getItemMetadata(sellerAddress, storeId, sku)));
}

export function getNumberOfSellers() {
    return contract.methods.getNumberOfSellers().call();
}

export async function getSellerAddresses() {
    const promises = [];
    const numberOfSellers = await getNumberOfSellers();
    for(let i = 0; i < numberOfSellers; i++) {
        promises.push(contract.methods.getSellerAddress(i).call());
    }
    return Promise.all(promises);
}

const getRoleName = (roleId) => {
    return Object.keys(ROLES).find(key => ROLES[key] === roleId);
}
ROLES.getRoleName = getRoleName;
