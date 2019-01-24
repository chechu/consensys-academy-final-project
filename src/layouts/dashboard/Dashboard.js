import React, { Component } from 'react';
import AddSellerContainer from '../../user/ui/addSellerForm/AddSellerContainer';
import AddStoreContainer from '../../store/ui/addStoreForm/AddStoreContainer';
import ListStoreContainer from '../../store/ui/listStore/ListStoreContainer';
import SetEmergencyContainer from '../../user/ui/setEmergencyButton/SetEmergencyContainer';
import AddAdminContainer from '../../user/ui/addAdminForm/AddAdminContainer';

import { VisibleOnlyAuthorized } from '../../util/wrappers';

class Dashboard extends Component {
    render() {
        const AddSellerForm = VisibleOnlyAuthorized(() =>
            <AddSellerContainer />
        )
        const AddStoreForm = VisibleOnlyAuthorized(() =>
            <AddStoreContainer />
        )
        const ListSellerStores = VisibleOnlyAuthorized(() =>
            <ListStoreContainer seller={this.props.authData.address} />
        )
        const ListBuyerStores = VisibleOnlyAuthorized(() =>
            <ListStoreContainer />
        )
        const AddAdminForm = VisibleOnlyAuthorized(() =>
            <AddAdminContainer />
        )
        const SetEmergency = VisibleOnlyAuthorized(() =>
            <SetEmergencyContainer />
        )

        return(
            <main className="container">
                <div className="pure-g">
                    <div className="pure-u-1-1">
                        <h1>Dashboard</h1>
                        <AddAdminForm authorizedRoles={['OWNER']} />
                        <SetEmergency authorizedRoles={['OWNER']} />
                        <AddSellerForm authorizedRoles={['ADMIN']}/>
                        <AddStoreForm authorizedRoles={['SELLER']}/>
                        <ListSellerStores authorizedRoles={['SELLER']}/>
                        <ListBuyerStores authorizedRoles={['BUYER']} />

                    </div>
                </div>
            </main>
        )
    }
}

export default Dashboard
