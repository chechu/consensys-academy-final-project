import { connect } from 'react-redux';
import ListItem from './ListItem';
import { pullItems } from '../../../util/actions';

const mapStateToProps = (state, ownProps) => {
    return {
        authUserAddress: state.user.data && state.user.data.address,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadStore: (sellerAddress, storeId) => {
            dispatch(pullItems(sellerAddress, storeId))
        }
    }
}

const ListItemContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ListItem)

export default ListItemContainer
