import React from 'react';
import { Container, Segment, Form, Input, Header } from 'semantic-ui-react';

class AddSeller extends React.Component {
    constructor(props) {
        super(props);

        this.state = { value: '' };

        this.handleChange = this.handleChange.bind(this);
        this.onAddSellerClick = props.onAddSellerClick;
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    render() {
        return (
            <Container text>
                <Segment raised>
                    <Header>Add a new seller user to the marketplace</Header>
                    <Form onSubmit={(event) => { this.onAddSellerClick(event, this.state.value)}}>
                        <Form.Group>
                            <Form.Field inline value={this.state.value} onChange={this.handleChange}>
                                <label>Seller address</label>
                                <Input placeholder='ETH address' />
                            </Form.Field>
                            <Form.Button positive
                                labelPosition='right'
                                icon='add circle'
                                content='Add seller'
                                 />
                        </Form.Group>
                    </Form>
                </Segment>
            </Container>
        );
    }
}

export default AddSeller
