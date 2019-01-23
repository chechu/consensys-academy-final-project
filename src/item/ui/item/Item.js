import React from 'react';
import { Card, Icon, Popup, Image, Menu, Button } from 'semantic-ui-react';
import RemoveItemContainer from '../removeItem/RemoveItemContainer';
import EditItemContainer from '../editItem/EditItemContainer';
import CheckoutItemContainer from '../checkoutItem/CheckoutItemContainer';
import { getWeb3 } from '../../../util/connectors';

class Item extends React.Component {
    constructor(props) {
        super(props);
        this.isOwner = (this.props.item.sellerAddress === this.props.authUserAddress);
    }

    render() {
        const web3 = getWeb3();
        return (
            <Card key={this.props.item.sku}>
                <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' />
                <Card.Content>
                    <Card.Header>{this.props.item.name}</Card.Header>
                    <Card.Meta>SKU: {this.props.item.sku.toString()}</Card.Meta>
                    <Card.Description>
                        Steve wants to add you to the group <strong>best friends</strong>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Menu compact icon='labeled'>
                        <Menu.Item name='amount'>
                            <Icon name='archive' />
                            <Popup position='top center'
                                trigger={<span>{this.props.item.availableNumItems}</span>}
                                content={<span>Availability: {this.props.item.availableNumItems} items</span>}/>
                        </Menu.Item>
                        <Menu.Item name='price'>
                            <Icon name='money bill alternate outline' />
                            <Popup position='top center' trigger={<span>{web3.utils.fromWei(this.props.item.price, 'finney')} F</span>}>
                                <Popup.Header>Price in Finney</Popup.Header>
                                <Popup.Content>
                                    <span>
                                        1 Finney = 0.001 Ether
                                        <br/>
                                        {web3.utils.fromWei(this.props.item.price, 'finney')} Finney = {web3.utils.fromWei(this.props.item.price, 'ether')} Ether
                                    </span>
                                </Popup.Content>
                            </Popup>
                        </Menu.Item>
                        <CheckoutItemContainer item={this.props.item} role={this.props.role} />
                    </Menu>
                </Card.Content>
                { this.isOwner &&
                    <Card.Content extra>
                        <div className='ui two buttons'>
                        <Button.Group fluid>
                            <EditItemContainer item={this.props.item} />
                            <RemoveItemContainer item={this.props.item} />
                        </Button.Group>
                        </div>
                    </Card.Content>
                }
            </Card>
        )
    }
}

export default Item
