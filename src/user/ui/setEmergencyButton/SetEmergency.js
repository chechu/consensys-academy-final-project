import React from 'react';
import { Container, Segment, Form, Header, Divider } from 'semantic-ui-react';

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
        const isEmergency = this.props.isEmergency;
        let title = 'Enable the emergency mode';
        let description = 'Only read operations and withdrawals will be accesible on the contract';
        if (this.props.isEmergency) {
            title = 'Disable the emergency mode';
            description = 'Every write operation will be accesible again on the contract';
        }
        return (
            <Container text>
                <Segment raised>
                    <Header>{title}</Header>
                    {description}
                    <Divider />
                    <Form onSubmit={(event) => { this.props.onToggleEmergencyClick(event)}}>
                        <Form.Group>
                            {isEmergency &&
                                <Form.Button positive
                                labelPosition='right'
                                icon='hand peace outline'
                                content='Disable emergency' />
                             }
                             {!isEmergency &&
                                <Form.Button negative
                                labelPosition='right'
                                icon='emergency'
                                content='Enable emergency' />
                            }
                        </Form.Group>
                    </Form>
                </Segment>
            </Container>
        );
    }
}

export default AddAdmin
