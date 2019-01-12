import React from 'react'

const SendVerificationButton = ({ onSendVerificationClick, onSendTransactionClick }) => {
  return(
  	<span>
	    <li className="pure-menu-item">
	      <a href="#" className="pure-menu-link" onClick={(event) => onSendVerificationClick(event)}>Send validation</a>
	    </li>
	    <li className="pure-menu-item">
	      <a href="#" className="pure-menu-link" onClick={(event) => onSendTransactionClick(event)}>Send transaction</a>
	    </li>
	</span>
  )
}

export default SendVerificationButton
