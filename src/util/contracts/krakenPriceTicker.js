import { getWeb3, DEFAULT_GAS_PRICE } from '../connectors'

const abi = require('./abi/KrakenPriceTicker.json').abi;
export const CONTRACT_ADDRESS = '0xdA8b4750A7EE5327Cd080eDc1A0251fd179F1C10';

export let contract;

export function initContract(from) {
    const web3 = getWeb3();
    contract = contract || new web3.eth.Contract(abi, CONTRACT_ADDRESS, { from, gasPrice: DEFAULT_GAS_PRICE });
}
