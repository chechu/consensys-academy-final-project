import React from 'react';
import { Card, Button } from 'semantic-ui-react';
import RemoveItemContainer from '../removeItem/RemoveItemContainer';

class Item extends React.Component {
    constructor(props) {
        super(props);
        this.isOwner = (this.props.item.sellerAddress === this.props.authUserAddress);
    }

    render() {
        return (
            <Card key={this.props.item.sku}>
                <Card.Content>
                    <Card.Header>{this.props.item.name}</Card.Header>
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
                        { this.isOwner && <RemoveItemContainer item={this.props.item} />}
                    </div>
                </Card.Content>
            </Card>
        )
    }
}

export default Item
