import { connect } from 'react-redux';
import Store from './Store';
import { pullStore } from '../../util/actions';

const mapStateToProps = (state, ownProps) => {
    const storeId = ownProps.params.storeId;
    const sellerAddress = ownProps.params.sellerAddress;
    return {
        store: state.store.storesBySeller[sellerAddress]
            && state.store.storesBySeller[sellerAddress].stores.find(it => it.storeId === storeId),
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadStore: (sellerAddress, storeId) => {
            dispatch(pullStore(sellerAddress, storeId));
        }
    }
}

const StoreContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Store)

export default StoreContainer
