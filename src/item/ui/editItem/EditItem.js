import React from 'react';
import { Modal, Button, Form, Icon, Input } from 'semantic-ui-react';

class EditItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...this.props.item, ...{ open: false } };
        this.onEditItemClick = props.onEditItemClick;
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value })
    close = () => this.setState({ open: false })
    open = () => this.setState({...this.props.item, ...{ open: true } })

    render() {
        return(
            <Modal size='tiny' open={this.state.open} trigger={<Button basic onClick={this.open} color='blue'><Icon name='compose'/>Edit</Button>}>
                <Modal.Header>Edit item [{this.props.item.name}]</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={(event) => { this.onEditItemClick(event, this.state, this.close)}}>
                        <Form.Group widths='equal'>
                            <Form.Input readOnly fluid required value={this.state.sku} name="sku" label='SKU' type="number" onChange={this.handleChange} />
                            <Form.Input fluid required value={this.state.name} name="name" label='Name' onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Field required>
                                <label>Price</label>
                                <Input type='number' fluid required
                                    value={this.state.price}
                                    label={{ basic: true, content: 'Wei' }} labelPosition='right'
                                    name='price' onChange={this.handleChange} />
                            </Form.Field>
                            <Form.Input fluid required value={this.state.availableNumItems} name="availableNumItems" label='Amount' type="number" onChange={this.handleChange} />
                        </Form.Group>
                        <Modal.Actions>
                            <Button onClick={this.close} negative>Cancel</Button>
                            <Button positive
                                labelPosition='right'
                                icon='checkmark'
                                content='Save'
                                type="submit" />
                        </Modal.Actions>
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }
}

export default EditItem
