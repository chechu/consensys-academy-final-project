import React from 'react';
import { Container, Segment, Form, Input, Header, Grid } from 'semantic-ui-react';

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
        const ensDescription = this.props.ensEnabled ? 'or the <strong>ENS name</strong> ' : '';
        const ensPlaceholder = this.props.ensEnabled ? ' or ENS name' : '';
        return (
            <Container text>
                <Segment raised>
                    <Grid columns={1} padded='vertically'>
                        <Grid.Row>
                            <Grid.Column>
                                <Header>Add a new seller user to the marketplace</Header>
                                <Header.Subheader>Introduce the <strong>ETH address</strong> {ensDescription}of the user to add as seller.</Header.Subheader>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Form onSubmit={(event) => { this.onAddSellerClick(event, this.state.value, this.props.ensEnabled)}}>
                                    <Form.Group>
                                        <Form.Field inline value={this.state.value} onChange={this.handleChange}>
                                            <label>Seller address</label>
                                            <Input placeholder={'Address' + ensPlaceholder} />
                                        </Form.Field>
                                        <Form.Button positive
                                            labelPosition='right'
                                            icon='add circle'
                                            content='Add seller'
                                             />
                                    </Form.Group>
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </Container>
        );
    }
}

export default AddSeller
