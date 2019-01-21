import React, { Component } from 'react'
import { Button, Confirm, Icon } from 'semantic-ui-react'

class RemoveItem extends Component {
    state = { open: false }

    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })
    confirm = () => {
        this.props.onConfirmRemoveItem(this.props.item);
        this.close();
    }

    render() {
        return (
            <span>
                <Button basic color='red' onClick={this.open}><Icon name='trash alternate'/>Remove</Button>
                <Confirm open={this.state.open} onCancel={this.close} onConfirm={this.confirm} />
            </span>
        )
    }
}

export default RemoveItem
