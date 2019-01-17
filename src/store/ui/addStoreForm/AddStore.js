import React from 'react';

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
            <form onSubmit={(event) => { this.onAddStoreClick(event, this.state.value)}}>
                <strong>Add store</strong><br/>
                <label>
                    Store name:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

export default AddStore
