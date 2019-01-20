import React from 'react';
import { Header, Modal, Button, Form, Icon } from 'semantic-ui-react';

class AddItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = { open: false, storeId: props.storeId };
        this.onAddItemClick = props.onAddItemClick;
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value })
    close = () => this.setState({ open: false })
    open = () => this.setState({ open: true })

    render() {
        return(
            <Modal open={this.state.open} trigger={<Button positive onClick={this.open}><Icon name='add circle'/>Add item</Button>}>
                <Modal.Content>
                    <Form onSubmit={(event) => { this.onAddItemClick(event, this.state, this.close)}}>
                        <Modal.Description>
                            <Header>Add a new item to your store</Header>
                                <Form.Input required name="sku" label='SKU' type="number" onChange={this.handleChange} />
                                <Form.Input required name="name" label='Name' onChange={this.handleChange} />
                                <Form.Input required name="price" label='Price' type="number" onChange={this.handleChange} />
                                <Form.Input required name="availableAmount" label='Amount' type="number" onChange={this.handleChange} />
                        </Modal.Description>
                        <Modal.Actions>
                            <Button onClick={this.close} negative>Cancel</Button>
                            <Button positive type='submit'>Add item</Button>
                        </Modal.Actions>
                    </Form>
                </Modal.Content>
            </Modal>
          )
    }
}

export default AddItem
