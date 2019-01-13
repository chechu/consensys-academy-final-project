import React from 'react';

class AddSeller extends React.Component {
    constructor(props) {
        super(props);

        this.state = { value: '' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onAddSellerClick = props.onAddSellerClick;
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        console.error('Legacy handleSubmit!');
    }

    render() {
        return (
            <form onSubmit={(event) => { this.onAddSellerClick(event, this.state.value)}}>
                <label>
                    Seller address:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

export default AddSeller
