import React from 'react';
import { Card, Button, Divider, Header, Icon } from 'semantic-ui-react';

class ListItem extends React.Component {
    constructor(props) {
        super(props);
        this.isOwner = (this.props.sellerAddress === this.props.authUserAddress);
    }

    async componentDidMount() {
        this.props.loadStore(this.props.sellerAddress, this.props.storeId);
    }

    getStoreItems(item) {
        return (
            <Card key={item.sku}>
                <Card.Content>
                    <Card.Header>{item.name}</Card.Header>
                    <Card.Meta>Friends of Elliot</Card.Meta>
                    <Card.Description>
                        Steve wants to add you to the group <strong>best friends</strong>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <div className='ui two buttons'>
                        <Button basic color='green'>
                            Approve
                        </Button>
                        <Button basic color='red'>
                            Decline
                        </Button>
                    </div>
                </Card.Content>
            </Card>
        )
    }

    render() {
        const items = [];
        if (this.props.store.items) {
            this.props.store.items.forEach((item) => {
                items.push(this.getStoreItems(item));
            });
        }

        return (
            <span key={this.props.store.name}>
                <Divider horizontal>
                    <Header as='h4'>
                        <Icon name='gift' />
                        Items of store: {this.props.store.name}
                    </Header>
                </Divider>
                { items && <Card.Group>{items}</Card.Group> }
            </span>
        )
    }
}

export default ListItem
