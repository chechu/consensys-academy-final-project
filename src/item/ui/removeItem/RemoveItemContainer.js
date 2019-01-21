import { connect } from 'react-redux'
import RemoveItem from './RemoveItem'
import { removeItem } from './RemoveItemActions'

const mapStateToProps = (state, ownProps) => {
    return { }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onConfirmRemoveItem: (item) => {
            dispatch(removeItem(item));
        }
    }
}

const RemoveItemContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(RemoveItem)

export default RemoveItemContainer
