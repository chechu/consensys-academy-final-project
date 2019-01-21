import React, { Component } from 'react';
import { Item } from 'semantic-ui-react';
import StoreSummaryContainer from '../ui/storeSummary/StoreSummaryContainer';
import ListItemContainer from '../../item/ui/listItem/ListItemContainer';

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
                            <span>
                                <Item.Group divided>
                                    <StoreSummaryContainer key={this.props.store.name} _store={this.props.store} />
                                </Item.Group>
                                <ListItemContainer _store={this.props.store} />
                            </span>
                        }
                    </div>
                </div>
            </main>
        )
    }
}

export default Store
