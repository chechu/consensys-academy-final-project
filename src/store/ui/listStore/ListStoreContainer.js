import { connect } from 'react-redux';
import ListStore from './ListStore';
import { pullStores, pullEveryStore } from '../../../util/actions';

const mapStateToProps = (state, ownProps) => {
    return {
        stores: state.store.storesBySeller,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        loadStores: (sellerAddresses) => {
            dispatch(pullStores(sellerAddresses));
        },
        loadEveryStore: () => {
            dispatch(pullEveryStore());
        },
    }
}

const ListStoreContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ListStore)

export default ListStoreContainer
