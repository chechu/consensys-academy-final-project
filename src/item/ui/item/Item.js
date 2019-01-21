import React from 'react';
import { Card, Button, Icon } from 'semantic-ui-react';

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
                        { this.isOwner &&
                            <Button basic color='red'>
                                <Icon name='trash alternate'/>Remove
                            </Button>
                        }
                    </div>
                </Card.Content>
            </Card>
        )
    }
}

export default Item
