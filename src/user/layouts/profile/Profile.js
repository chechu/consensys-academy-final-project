import React, { Component } from 'react';
import { VisibleOnlyAuthorized } from '../../../util/wrappers';
import WithdrawFundsContainer from '../../ui/withdrawButton/WithdrawFundsContainer';

class Profile extends Component {
    render() {
        const WithdrawFunds = VisibleOnlyAuthorized(() =>
            <WithdrawFundsContainer />
        )
        return(
            <main className="container">
                <div className="pure-g">
                    <div className="pure-u-1-1">
                        <h1>Profile</h1>
                        <p>
                            <label>Address:</label> {this.props.authData.address} |
                            <label>Role</label> {this.props.authData.role.name}
                        </p>
                        <WithdrawFunds authorizedRoles={['SELLER']} />
                    </div>
                </div>
            </main>
        )
    }
}

export default Profile;
