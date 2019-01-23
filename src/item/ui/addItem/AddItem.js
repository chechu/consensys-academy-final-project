import React from 'react';
import { Modal, Button, Form, Icon, Input } from 'semantic-ui-react';

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
            <Modal size='tiny' open={this.state.open} trigger={<Button positive onClick={this.open}><Icon name='add circle'/>Add item</Button>}>
                <Modal.Header>Add a new item to your store</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={(event) => { this.onAddItemClick(event, this.state, this.close)}}>
                        <Form.Group widths='equal'>
                            <Form.Input fluid required name='sku' label='SKU' type='number' onChange={this.handleChange} />
                            <Form.Input fluid required name='name' label='Name' onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Field required>
                                <label>Price</label>
                                <Input type='number' fluid required
                                    label={{ basic: true, content: 'Finney' }} labelPosition='right'
                                    name='price' onChange={this.handleChange} />
                            </Form.Field>
                            <Form.Input fluid required name='availableNumItems' label='Amount' type='number' onChange={this.handleChange} />
                        </Form.Group>
                        <Modal.Actions>
                            <Button onClick={this.close} negative>Cancel</Button>
                            <Button positive
                                labelPosition='right'
                                icon='checkmark'
                                content='Add item'
                                type='submit' />
                        </Modal.Actions>
                    </Form>
                </Modal.Content>

            </Modal>
        )
    }
}

export default AddItem
