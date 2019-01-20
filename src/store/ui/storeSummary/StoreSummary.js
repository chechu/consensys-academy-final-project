import React from 'react';
import { Item, Label } from 'semantic-ui-react';
import { Link } from 'react-router';
import AddItemContainer from '../../../item/ui/addItem/AddItemContainer';

class StoreSummary extends React.Component {
    constructor(props) {
        super(props);
        this.isOwner = (this.props.sellerAddress === this.props.authUserAddress);
    }

    async componentDidMount() {
        this.props.loadStore(this.props.sellerAddress, this.props.storeId);
    }

    render() {
        return(
            <Item>
                <Item.Image src='https://react.semantic-ui.com/images/wireframe/image.png' />

                <Item.Content>

                    <Item.Header>
                        <Link to={`/store/${this.props.sellerAddress}/${this.props.storeId}`}>
                            {this.props.store.name}
                        </Link>
                    </Item.Header>
                    <Item.Meta>
                        <span className='cinema'>Union Square 14</span>
                    </Item.Meta>
                    <Item.Description>Number of items: {this.props.store.numItems}</Item.Description>
                    <Item.Extra>
                        { this.isOwner && <AddItemContainer storeId={this.props.storeId} /> }
                        <Label icon='globe' content='Additional Languages' />
                    </Item.Extra>
                </Item.Content>
            </Item>
          )
    }
}

export default StoreSummary
