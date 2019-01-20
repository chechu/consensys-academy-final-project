import { getWeb3 } from '../connectors'

const abi = require('./abi/Marketplace.json').abi;
const CONTRACT_ADDRESS = '0x2502de93e0C5241714a3b7aAa52c9ed7E8d4dbBA';

export let contract;

export function initContract(from) {
    const DEFAULT_GAS_PRICE = '50000000000'; // 50 gwei in this case
    const web3 = getWeb3();
    contract = contract || new web3.eth.Contract(abi, CONTRACT_ADDRESS, { from, gasPrice: DEFAULT_GAS_PRICE });
}

export const ROLES = {
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
    return { name: storeMetadata[0], numItems: storeMetadata[1], storeId };
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

const getRoleName = (roleId) => {
    return Object.keys(ROLES).find(key => ROLES[key] === roleId);
}
ROLES.getRoleName = getRoleName;
