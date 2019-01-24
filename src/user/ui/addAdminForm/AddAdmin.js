import React from 'react';
import { Container, Segment, Form, Input, Header } from 'semantic-ui-react';

class AddAdmin extends React.Component {
    constructor(props) {
        super(props);

        this.state = { value: '' };

        this.handleChange = this.handleChange.bind(this);
        this.onAddAdminClick = props.onAddAdminClick;
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    render() {
        return (
            <Container text>
                <Segment raised>
                    <Header>Add a new admin user to the marketplace</Header>
                    <Form onSubmit={(event) => { this.onAddAdminClick(event, this.state.value)}}>
                        <Form.Group>
                            <Form.Field inline value={this.state.value} onChange={this.handleChange}>
                                <label>Admin address</label>
                                <Input placeholder='ETH address' />
                            </Form.Field>
                            <Form.Button positive
                                labelPosition='right'
                                icon='add circle'
                                content='Add admin'
                                 />
                        </Form.Group>
                    </Form>
                </Segment>
            </Container>
        );
    }
}

export default AddAdmin
