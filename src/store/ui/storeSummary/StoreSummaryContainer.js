import { connect } from 'react-redux';
import StoreSummary from './StoreSummary';
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
            dispatch(pullStore(sellerAddress, storeId))
        }
    }
}

const StoreSummaryContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(StoreSummary)

export default StoreSummaryContainer
