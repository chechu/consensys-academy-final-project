import { getWeb3, DEFAULT_GAS_PRICE } from '../connectors'

const abi = require('./abi/KrakenPriceTicker.json').abi;
export const CONTRACT_ADDRESS = '0x3C81F477287d9a9E912e526fC0bDC861301D9590';

export let contract;

export function initContract(from) {
    const web3 = getWeb3();
    contract = contract || new web3.eth.Contract(abi, CONTRACT_ADDRESS, { from, gasPrice: DEFAULT_GAS_PRICE });
}
