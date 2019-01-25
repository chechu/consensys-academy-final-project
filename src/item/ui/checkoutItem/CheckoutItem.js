import React from 'react';
import { Popup, Modal, Input, Form, Icon, Menu, Table } from 'semantic-ui-react';
import { ROLES } from '../../../util/contracts/marketplace';
import { getWeb3 } from '../../../util/connectors';

class CheckoutItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = { open: false, numItemsToPurchase: 1 };
        this.onCheckoutItemClick = props.onCheckoutItemClick;
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }
    close = () => this.setState({ open: false })
    open = () => this.setState({ open: true })

    MenuItem() {
        const availability = this.props.item.availableNumItems > 0;
        const allowToBuy = (this.props.role.id === ROLES.BUYER) && availability;
        const classNameAvailability = (availability ? 'available' : 'unavailable');

        return (
            <Menu.Item className={classNameAvailability} as='div' disabled={!allowToBuy} onClick={this.open} name='buy'>
                <Icon name='shop' /> Buy
            </Menu.Item>
        )
    }

    render() {
        const web3 = getWeb3();
        const BN = web3.utils.BN;
        const bnPrice = new BN(this.props.item.price);
        const menuItem = this.MenuItem();
        const ETHPriceInUSD = this.props.ETHPriceInUSD;

        let unitaryUSDPrice = (<Popup trigger={<span>Not available</span>}><Popup.Header>ETH - USD exchange rate not available</Popup.Header><Popup.Content>This data is provided by an integration with Oraclize, and is only available in Rinkeby</Popup.Content></Popup>);
        let totalUSDPrice = unitaryUSDPrice;
        if (ETHPriceInUSD) {
            unitaryUSDPrice = (web3.utils.fromWei(this.props.item.price, 'ether') * ETHPriceInUSD).toFixed(2);
            totalUSDPrice = (web3.utils.fromWei(bnPrice.mul(new BN(this.state.numItemsToPurchase)), 'ether') * ETHPriceInUSD).toFixed(2);
        }

        return(
            <Modal onClose={this.close} size='mini' open={this.state.open} trigger={menuItem}>
                <Modal.Header>Checkout items</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={(event) => { this.onCheckoutItemClick(event, this.state.numItemsToPurchase, this.close)}}>
                        <Input fluid onChange={this.handleChange}
                            action={{ color: 'teal', labelPosition: 'left', icon: 'cart', content: 'Checkout' }}
                            actionPosition='left' placeholder='Items to buy'
                            value={this.state.numItemsToPurchase} required name='numItemsToPurchase' type='number'
                            label={{ basic: true, content: '# items' }} labelPosition='right' />
                    </Form>
                    <Table definition>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell />
                                <Table.HeaderCell>Finney</Table.HeaderCell>
                                <Table.HeaderCell>Ether</Table.HeaderCell>
                                <Table.HeaderCell>
                                    <Popup hideOnScroll trigger={<span>USD*</span>}>
                                        <Popup.Header>Updated data</Popup.Header>
                                        <Popup.Content>Data from <a href='http://www.oraclize.it'>Oraclize</a></Popup.Content>
                                    </Popup>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>Unitary price</Table.Cell>
                                <Table.Cell>{web3.utils.fromWei(this.props.item.price, 'finney')}</Table.Cell>
                                <Table.Cell>{web3.utils.fromWei(this.props.item.price, 'ether')}</Table.Cell>
                                <Table.Cell>{unitaryUSDPrice}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>Total price</Table.Cell>
                                <Table.Cell>{web3.utils.fromWei(bnPrice.mul(new BN(this.state.numItemsToPurchase)), 'finney')}</Table.Cell>
                                <Table.Cell>{web3.utils.fromWei(bnPrice.mul(new BN(this.state.numItemsToPurchase)), 'ether')}</Table.Cell>
                                <Table.Cell>{totalUSDPrice}</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                      </Table>
                </Modal.Content>
            </Modal>
        )
    }
}

export default CheckoutItem
