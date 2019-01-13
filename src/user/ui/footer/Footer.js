import React from 'react'
import ExpectingConfirmationsContainer from '../../../tx/ui/expectingConfirmations/ExpectingConfirmationsContainer';

const Footer = ({ address, roleName }) => {
  return(
  	<div>
        <div>Address: {address} | Role: {roleName}</div>
        <ExpectingConfirmationsContainer />
  	</div>
  )
}

export default Footer
