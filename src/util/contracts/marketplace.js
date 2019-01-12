import { getWeb3 } from '../connectors'

const abi = require('./abi/Marketplace.json').abi;
const contractAddress = '0xe11E56e18d34f591bAD7Dd888127976D5Af9a79E';

export let contract;

export function initContract(from) {
    const web3 = getWeb3();
    contract = contract || new web3.eth.Contract(abi, contractAddress, { from });
}

export const ROLES = {
    ADMIN: '0',
    SELLER: '1',
    BUYER: '2',
};

const getRoleName = (roleId) => {
    return Object.keys(ROLES).find(key => ROLES[key] === roleId);
}
ROLES.getRoleName = getRoleName;
