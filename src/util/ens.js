import ENS from 'ethereum-ens';
import { getWeb3 } from './connectors';

let ens;
export function resolveAddress(address, ensEnabled) {
    if(!address || address.startsWith('0x')) {
        return Promise.resolve(address);
    }

    if(!ensEnabled) {
        throw new Error('ENS is not enabled in this ETH network');
    }

    ens = ens || new ENS(getWeb3());
    return ens.resolver(address).addr();
}
