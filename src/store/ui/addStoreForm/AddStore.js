import React from 'react';
import { Container, Segment, Form, Header, Input } from 'semantic-ui-react';

class AddStore extends React.Component {
    constructor(props) {
        super(props);

        this.state = { value: '' };

        this.handleChange = this.handleChange.bind(this);
        this.onAddStoreClick = props.onAddStoreClick;
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    render() {
        return (
            <Container text>
                <Segment raised>
                    <Header>Add a new store</Header>
                    <Form onSubmit={(event) => { this.onAddStoreClick(event, this.state.value)}}>
                        <Form.Group>
                            <Form.Field inline value={this.state.value} onChange={this.handleChange}>
                                <label>Store name</label>
                                <Input placeholder='Store name' />
                            </Form.Field>
                            <Form.Button positive
                                labelPosition='right'
                                icon='add circle'
                                content='Add store'
                                 />
                        </Form.Group>
                    </Form>
                </Segment>
            </Container>
        );
    }
}

export default AddStore
