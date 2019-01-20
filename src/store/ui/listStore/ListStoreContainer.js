import { connect } from 'react-redux';
import ListStore from './ListStore';
import { pullStores } from '../../../util/actions';

const mapStateToProps = (state, ownProps) => {
    return {
        stores: state.store.storesBySeller,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        loadStores: (sellerAddresses) => {
            dispatch(pullStores(sellerAddresses))
        }
    }
}

const ListStoreContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ListStore)

export default ListStoreContainer
