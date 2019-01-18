import { getWeb3 } from './connectors';

export function addressToBytes32(address) {
    getWeb3().utils.asciiToHex(address.substring(2)); // Removing the initial 0x
}

export function bytes32ToAddress(bytes32) {
    console.log({bytes32})
    return `0x${getWeb3().utils.hexToAscii(bytes32)}`;
}
