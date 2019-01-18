import React from 'react';
import { Button, Icon, Image, Item, Label, Divider, Header } from 'semantic-ui-react';
import { contract } from '../../../util/contracts/marketplace';
import { getWeb3 } from '../../../util/connectors';
import { addressToBytes32, bytes32ToAddress } from '../../../util/utils';

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
        console.log({numberOfStores})
        for(let i = 0; i < numberOfStores; i++) {
            promises.push(contract.methods.getStoreId(sellerAddress, i).call());
        }
        return Promise.all(promises);
    }

    getStoresMetadata(sellerAddresses) {
        return Promise.all(sellerAddresses.map(sellerAddress => (this.getStoreIds(sellerAddress)
            .then(storeIds => Promise.all(storeIds.map(storeId => contract.methods.getStoreMetadata(this.web3.utils.asciiToHex(sellerAddress), this.web3.utils.asciiToHex(storeIds)).call())))
        )));
    }

    getSellerAddresses() {
        const stringAddresses = [this.props.seller];
        return stringAddresses.map(it => addressToBytes32(it));
    }

    componentDidMount() {
        const sellers = this.getSellerAddresses();
        this.getStoresMetadata(sellers).then((metadata) => {
            const metadataMap = sellers.reduce((acc, current, index) => { acc[bytes32ToAddress(current)] = metadata[index]; return acc; }, {});
            this.setState({ metadata: metadataMap });
        })
    }

    getStoreListItems() {
        const items = this.state.metadata.map(name =>
            <Item key={name}>
                <Item.Image src='https://react.semantic-ui.com/images/wireframe/image.png' />

                <Item.Content>
                    <Item.Header as='a'>{name}</Item.Header>
                    <Item.Meta>
                        <span className='cinema'>Union Square 14</span>
                    </Item.Meta>
                    <Item.Description>{'paragraph'}</Item.Description>
                    <Item.Extra>
                        <Label>IMAX</Label>
                        <Label icon='globe' content='Additional Languages' />
                    </Item.Extra>
                </Item.Content>
            </Item>
        );

        return (
            <span>
            <Divider horizontal>
                <Header as='h4'>
                    <Icon name='tag' />
                    Description
                </Header>
            </Divider>
            <Item.Group divided>{items}</Item.Group></span>
        )
    }

    render() {
        return (<span>{this.getStoreListItems()}</span>)
    }
}

export default ListStore
