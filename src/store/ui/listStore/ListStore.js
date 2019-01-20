import React from 'react';
import { Icon, Item, Divider, Header } from 'semantic-ui-react';
import StoreSummaryContainer from '../storeSummary/StoreSummaryContainer';

class ListStore extends React.Component {
    getSellerAddresses() {
        // TODO: Support of multi sellers
        return [this.props.seller];
    }

    async componentDidMount() {
        const sellerAddresses = this.getSellerAddresses();
        this.props.loadStores(sellerAddresses);
    }

    getStoreItems(sellerAddress) {
        let items;
        if (this.props.stores && this.props.stores[sellerAddress]) {
            items = this.props.stores[sellerAddress].stores.map(storeMetadata =>
                <StoreSummaryContainer key={storeMetadata.name} sellerAddress={sellerAddress} storeId={storeMetadata.storeId} />
            );
        }

        return (
            <span key={sellerAddress}>
                <Divider horizontal>
                    <Header as='h4'>
                        <Icon name='gift' />
                        Stores of seller: {sellerAddress}
                    </Header>
                </Divider>
                { items && <Item.Group divided>{items}</Item.Group> }
            </span>
        )
    }

    render() {
        const stores = [];
        if (this.props.stores) {
            Object.keys(this.props.stores).forEach((sellerAddress) => {
                stores.push(this.getStoreItems(sellerAddress));
            });
        }
        return (<span>{stores}</span>)
    }
}

export default ListStore
