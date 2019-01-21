import React from 'react';
import { Card, Divider, Header, Icon } from 'semantic-ui-react';
import ItemContainer from '../item/ItemContainer';

class ListItem extends React.Component {
    constructor(props) {
        super(props);
        this.isOwner = (this.props._store.sellerAddress === this.props.authUserAddress);
    }

    async componentDidMount() {
        this.props.loadStore(this.props._store.sellerAddress, this.props._store.storeId);
    }

    render() {
        const items = [];
        if (this.props._store.items) {
            this.props._store.items.forEach((item) => {
                items.push(<ItemContainer key={item.sku} item={item} />);
            });
        }

        return (
            <span key={this.props._store.name}>
                <Divider horizontal>
                    <Header as='h4'>
                        <Icon name='gift' />
                        Items of store: {this.props._store.name}
                    </Header>
                </Divider>
                { items && <Card.Group>{items}</Card.Group> }
            </span>
        )
    }
}

export default ListItem
