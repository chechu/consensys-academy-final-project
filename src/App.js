import React, { Component } from 'react'
import { Link } from 'react-router'
import { HiddenOnlyAuth, VisibleOnlyAuth, VisibleOnlyAuthorized } from './util/wrappers.js'

// UI Components
import LoginButtonContainer from './user/ui/loginbutton/LoginButtonContainer'
import LogoutButtonContainer from './user/ui/logoutbutton/LogoutButtonContainer'
import FooterContainer from './user/ui/footer/FooterContainer'

// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  render() {
    const OnlyAuthLinks = VisibleOnlyAuth(() =>
      <span>
        <li className="pure-menu-item">
          <Link to="/dashboard" className="pure-menu-link">Dashboard</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/profile" className="pure-menu-link">Profile</Link>
        </li>
        <LogoutButtonContainer />
      </span>
    )

    const OnlyGuestLinks = HiddenOnlyAuth(() =>
      <span>
        <LoginButtonContainer />
      </span>
    )

    const OnlyAuthFooter = VisibleOnlyAuth(() =>
      <span>
        <OnlyAuthorizedData authorizedRoles={['ADMIN']} />
        <FooterContainer/>
      </span>
    )

    const OnlyAuthorizedData = VisibleOnlyAuthorized(() =>
        <span>Authorized!</span>
    )

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <Link to="/" className="pure-menu-heading pure-menu-link">Jesus Marketplace</Link>
          <ul className="pure-menu-list navbar-right">
            <OnlyGuestLinks />
            <OnlyAuthLinks />
          </ul>
        </nav>

        {this.props.children}

        <OnlyAuthFooter />
      </div>
    );
  }
}

export default App