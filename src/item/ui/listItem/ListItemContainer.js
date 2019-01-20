import { connect } from 'react-redux';
import ListItem from './ListItem';
import { pullStore } from '../../../util/actions';

const mapStateToProps = (state, ownProps) => {
    return {
        authUserAddress: state.user.data && state.user.data.address,
        store: state.store.storesBySeller[ownProps.sellerAddress]
            && state.store.storesBySeller[ownProps.sellerAddress].stores.find(it => it.storeId === ownProps.storeId),
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadStore: (sellerAddress, storeId) => {
            dispatch(pullStore(sellerAddress, storeId, true))
        }
    }
}

const ListItemContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ListItem)

export default ListItemContainer
