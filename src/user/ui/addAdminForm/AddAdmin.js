import React from 'react';
import { Container, Segment, Form, Input, Header, Grid } from 'semantic-ui-react';

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
        const ensDescription = this.props.ensEnabled ? 'or the <strong>ENS name</strong> ' : '';
        const ensPlaceholder = this.props.ensEnabled ? ' or ENS name' : '';
        return (
            <Container text>
                <Segment raised>
                    <Grid columns={1} padded='vertically'>
                        <Grid.Row>
                            <Grid.Column>
                                <Header>Add a new admin user to the marketplace</Header>
                                <Header.Subheader>Introduce the <strong>ETH address</strong> {ensDescription}of the user to add as administrator.</Header.Subheader>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Form onSubmit={(event) => { this.onAddAdminClick(event, this.state.value, this.props.ensEnabled)}}>
                                    <Form.Group>
                                        <Form.Field inline value={this.state.value} onChange={this.handleChange}>
                                            <label>Admin address</label>
                                            <Input placeholder={'Address' + ensPlaceholder} />
                                        </Form.Field>
                                        <Form.Button positive
                                            labelPosition='right'
                                            icon='add circle'
                                            content='Add admin'
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

export default AddAdmin
