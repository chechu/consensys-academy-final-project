import { connect } from 'react-redux';
import Item from './Item';
import { pullItems } from '../../../util/actions';

const mapStateToProps = (state, ownProps) => {
    const authUserAddress = state.user.data && state.user.data.address;
    const role = state.user.data && state.user.data.role;
    return { authUserAddress, role };
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadItem: (sellerAddress, storeId, sku) => {
            dispatch(pullItems(sellerAddress, storeId))
        }
    }
}

const ItemContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Item)

export default ItemContainer
