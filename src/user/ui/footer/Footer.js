import React from 'react';
import ExpectingConfirmationsContainer from '../../../tx/ui/expectingConfirmations/ExpectingConfirmationsContainer';
import { getWeb3 } from '../../../util/connectors';

const Footer = ({ address, roleName, balance }) => {
    return(
    	<div>
            <div>Address: {address} | Role: {roleName} { balance && <span>| Balance: {getWeb3().utils.fromWei(balance, 'finney')} Finney</span>}</div>
            <ExpectingConfirmationsContainer />
  	    </div>
    )
}

export default Footer
