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
                        <WithdrawFunds authorizedRoles={['SELLER']} />
                    </div>
                </div>
            </main>
        )
    }
}

export default Profile;
