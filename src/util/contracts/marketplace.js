import { getWeb3 } from '../connectors'

const abi = require('./abi/Marketplace.json').abi;
const CONTRACT_ADDRESS = '0x1c3EdC96133f994F8Ae8BEeddBc3054ce9967423';

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

const getRoleName = (roleId) => {
    return Object.keys(ROLES).find(key => ROLES[key] === roleId);
}
ROLES.getRoleName = getRoleName;
