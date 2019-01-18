import React, { Component } from 'react';
import { VisibleOnlyAuthorized } from '../../util/wrappers.js';

class Store extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <main className="container">
                <div className="pure-g">
                    <div className="pure-u-1-1">
                        <h1><span>My store id: {this.props.params.storeId}</span></h1>
                    </div>
                </div>
            </main>
        )
    }
}

export default Store
