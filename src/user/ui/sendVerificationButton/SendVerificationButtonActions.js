import { getUport } from './../../../util/connectors'
import marketplaceContract from '../../../util/contracts/marketplace'

export const SEND_VERIFICATION = 'SEND_VERIFICATION'
function validationSent() {
  return {
    type: SEND_VERIFICATION
  }
}

export const SEND_TRANSACTION = 'SEND_TRANSACTION'
function transactionSent() {
  return {
    type: SEND_TRANSACTION
  }
}

export function sendTransaction() {
  return function(dispatch) {
    dispatch(transactionSent());
/*
    marketplaceContract.setStatus(21, 'setStatusReq')
    uport.onResponse('setStatusReq').then(payload => {
      console.log('Set status sent: ', { payload });
      const txId = payload.res
    })
*/
/*
    const txobject = {
      to: '0xf87bD3fF5939d704F7130223954762B02E34eb4a',
      value: '10000000000',
      fn: "setStatus(uint 11)",
      appName: 'Jesus Marketplace'
    }
    uport.sendTransaction(txobject, 'setStatus');
    uport.onResponse('setStatus').then(res => {
      console.log('Set status sent: ', { res });
      const txHash = res.payload;
    })
*/
  }
}

export function sendVerification() {
  return function(dispatch) {
    dispatch(validationSent());

    const unsignedClaim = {
      'Jesus Marketplace info': {
        Role: 'SELLER'
      }
    };

    // const sub = uport.did;

    getUport().sendVerification({
      exp: null,//Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
      claim: unsignedClaim,
    })
/*
    uport.requestVerificationSignature(unsignedClaim, sub)

    uport.onResponse('verSigReq')
      .then(res => {
        const signedClaim = res.payload
        console.log({signedClaim})
      })
*/
  }
}
