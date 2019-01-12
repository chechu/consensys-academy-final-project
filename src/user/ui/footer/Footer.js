import React from 'react'

const Footer = ({ address, roleName }) => {
  return(
  	<span>
        Address: {address} | Role: {roleName}
  	</span>
  )
}

export default Footer
