import React from 'react'

// Images
import uPortLogo from '../../../img/uport-logo.svg'
import metamaskLogo from '../../../img/metamask-logo.png'

const LoginButton = ({ onLoginUserClick }) => {
  return(
    <span>
        <li className="pure-menu-item">
          <a href="#" className="pure-menu-link" onClick={(event) => onLoginUserClick(event, 'uport')}><img className="uport-logo" src={uPortLogo} alt="UPort Logo" />Login with UPort</a>
        </li>
        <li className="pure-menu-item">
          <a href="#" className="pure-menu-link" onClick={(event) => onLoginUserClick(event, 'browserProvider')}><img className="metamask-logo" src={metamaskLogo} alt="Browser provider Logo" />Login with Browser</a>
        </li>
    </span>
  )
}

export default LoginButton
