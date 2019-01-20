import React, { Component } from 'react';
import { Item } from 'semantic-ui-react';
import StoreSummaryContainer from '../ui/storeSummary/StoreSummaryContainer';

class Store extends Component {

    constructor(props) {
        super(props);
        this.storeId = this.props.params.storeId;
        this.sellerAddress = this.props.params.sellerAddress;
    }

    async componentDidMount() {
        this.props.loadStore(this.sellerAddress, this.storeId);
    }

    render() {
        return(
            <main className="container">
                <div className="pure-g">
                    <div className="pure-u-1-1">
                        <h1><span>My store id: {this.storeId}</span></h1>
                        { this.props.store &&
                            <Item.Group divided>
                                <StoreSummaryContainer key={this.props.store.name} sellerAddress={this.sellerAddress} storeId={this.storeId} />
                            </Item.Group>
                        }
                    </div>
                </div>
            </main>
        )
    }
}

export default Store
