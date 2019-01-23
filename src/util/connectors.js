import { Connect } from 'uport-connect'
import { Credentials } from 'uport-credentials'
import Web3 from 'web3';

let web3;
let uport;
const HTTP_PROVIDER_URL = 'http://127.0.0.1:8545'; // ganache-cli

export const DEFAULT_GAS_PRICE = '50000000000'; // 50 gwei in this case
export const DEFAULT_GAS_LIMIT_DELETE_OPERATION = 100000;
export const DEFAULT_GAS_LIMIT_WITHDRAW_OPERATION = 100000;

export function initUport() {
    uport = new Connect('Jesus Marketplace', {
        network: 'rinkeby',
        profileImage: {'/': '/ipfs/QmRpJ9spc8DuFJTBh91Xm1L8TgvE3tvo2p5UvTxcEwVhsm'},
    });

    // Only for development. In a production environment this should be provided with a flow that implies the server
    const initialState = {
        keypair: {
            did: 'did:ethr:0x2ebe2f34bec700bc2a04e26ae2824c767587e6ee',
            privateKey: 'b06523c8650754c4ea456f9de48a863fa044f0d9d68be6af72e01e510cae24fb'
        },
    }
    uport.setState(initialState);
    uport.keypair = initialState.keypair;
    uport.credentials = new Credentials({...uport.keypair, ...uport.resolverConfigs})

    web3 = new Web3(uport.getProvider())

    return { uport, web3 };
}

export async function initBrowserProvider() {
    // Source https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    // Modern dapp browsers...
    if (window.ethereum) {
        try {
            // Request account access if needed
            await window.ethereum.enable();
            web3 = new Web3(window.ethereum);
            // Acccounts now exposed
            // web3.eth.sendTransaction({/* ... */});
        } catch (error) {
            // User denied account access...
            console.log('Used denied access');
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
        // Acccounts always exposed
        // web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        web3 = new Web3(new web3.providers.HttpProvider(HTTP_PROVIDER_URL));
    }

    return web3;
}

export function getWeb3() {
    return web3;
}

export function getUport() {
    return uport;
}
