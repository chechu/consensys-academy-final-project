import React, { Component } from 'react'

class Profile extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Profile</h1>
            <p>
              <label>Address:</label> {this.props.authData.address} |
              <label>Role</label> {this.props.authData.role.name}
            </p>
          </div>
        </div>
      </main>
    )
  }
}

export default Profile
