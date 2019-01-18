import React from 'react';
import { Button, Icon, Image, Item, Label, Divider, Header } from 'semantic-ui-react';
import { Link } from 'react-router';
import { contract } from '../../../util/contracts/marketplace';
import { getWeb3 } from '../../../util/connectors';

class ListStore extends React.Component {
    constructor(props) {
        super(props);
        this.state = { metadata: [] };
        this.web3 = getWeb3();
    }

    getNumberOfStores(sellerAddress) {
        return contract.methods.getNumberOfStores(sellerAddress).call();
    }

    async getStoreIds(sellerAddress) {
        const promises = [];
        const numberOfStores = await this.getNumberOfStores(sellerAddress);
        for(let i = 0; i < numberOfStores; i++) {
            promises.push(contract.methods.getStoreId(sellerAddress, i).call());
        }
        return Promise.all(promises);
    }

    getStoresMetadata(sellerAddresses) {
        return Promise.all(sellerAddresses.map(sellerAddress => (this.getStoreIds(sellerAddress)
            .then(storeIds => Promise.all(storeIds.map(async storeId => {
                const storeMetadata = await contract.methods.getStoreMetadata(sellerAddress, storeId).call();
                return { name: storeMetadata[0], numItems: storeMetadata[1], storeId };
            })))
            .then(metadatas => ({ [sellerAddress]: metadatas }))
        )));
    }

    getSellerAddresses() {
        return [this.props.seller];
    }

    async componentDidMount() {
        const sellers = this.getSellerAddresses();
        await this.getStoresMetadata(sellers).then((metadatas) => {
            const metadataMap = metadatas.reduce((acc, current) => ({ ...acc, ...current }), {})
            this.setState({ metadata: metadataMap });
        })
    }

    getStoreItems(sellerAddress) {
        const items = this.state.metadata[sellerAddress].map(storeMetadata =>
            <Item key={storeMetadata.name} as={Link} to={'/store/' + storeMetadata.storeId}>
                <Item.Image src='https://react.semantic-ui.com/images/wireframe/image.png' />

                <Item.Content>
                    <Item.Header>{storeMetadata.name}</Item.Header>
                    <Item.Meta>
                        <span className='cinema'>Union Square 14</span>
                    </Item.Meta>
                    <Item.Description>Number of items: {storeMetadata.numItems}</Item.Description>
                    <Item.Extra>
                        <Label>IMAX</Label>
                        <Label icon='globe' content='Additional Languages' />
                    </Item.Extra>
                </Item.Content>
            </Item>
        );

        return (
            <span key={sellerAddress}>
                <Divider horizontal>
                    <Header as='h4'>
                        <Icon name='gift' />
                        Stores of seller: {sellerAddress}
                    </Header>
                </Divider>
                <Item.Group divided>{items}</Item.Group>
            </span>
        )
    }

    render() {
        const stores = [];
        Object.keys(this.state.metadata).forEach((sellerAddress) => {
            stores.push(this.getStoreItems(sellerAddress));
        });
        return (<span>{stores}</span>)
    }
}

export default ListStore
