import React, { Component } from 'react';
import AddSellerContainer from '../../user/ui/addSellerForm/AddSellerContainer';
import { VisibleOnlyAuthorized } from '../../util/wrappers.js';

class Dashboard extends Component {
    render() {
        const AddSellerForm = VisibleOnlyAuthorized(() =>
            <AddSellerContainer from={this.props.authData.address} />
        )

        return(
            <main className="container">
                <div className="pure-g">
                    <div className="pure-u-1-1">
                        <h1>Dashboard</h1>
                        <AddSellerForm authorizedRoles={['ADMIN']}/>
                    </div>
                </div>
            </main>
        )
    }
}

export default Dashboard
