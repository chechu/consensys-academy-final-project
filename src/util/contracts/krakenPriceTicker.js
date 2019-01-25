import { getWeb3, DEFAULT_GAS_PRICE } from '../connectors'

const abi = require('./abi/KrakenPriceTicker.json').abi;
const CONTRACT_ADDRESS = '0xa88ec2c91f51b3FF4db6dc5c66cA684663eB3af1';

export let contract;

export function initContract(from) {
    const web3 = getWeb3();
    contract = contract || new web3.eth.Contract(abi, CONTRACT_ADDRESS, { from, gasPrice: DEFAULT_GAS_PRICE });
}
