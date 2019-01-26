import { getWeb3, DEFAULT_GAS_PRICE } from '../connectors';
import { ETH_PRICE_UPDATED } from '../actions';
import config from '../../../config';

const abi = require('./abi/KrakenPriceTicker.json').abi;
export const CONTRACT_ADDRESS = config.krakenPriceTikerAddress;

export let contract;

export function initContract(from) {
    const web3 = getWeb3();
    contract = contract || new web3.eth.Contract(abi, CONTRACT_ADDRESS, { from, gasPrice: DEFAULT_GAS_PRICE });
}

export function subscribeToKrakenPriceTicker(address, dispatch) {
    initContract(address);

    contract.events.LogNewKrakenPriceTicker({ fromBlock: 0 }, (error, res) => {
        if (!error) {
            if (res.returnValues && res.returnValues.price) {
                dispatch({ type: ETH_PRICE_UPDATED, price: parseFloat(res.returnValues.price, 10) });
            }
        }
    });
}
