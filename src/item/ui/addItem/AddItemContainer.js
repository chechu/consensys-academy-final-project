import { connect } from 'react-redux'
import AddItem from './AddItem'
import { addItem } from './AddItemActions'

const mapStateToProps = (state, ownProps) => {
    return {
        authUserAddress: state.user.data && state.user.data.address,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAddItemClick: (event, itemProps, closeModal) => {
            event.preventDefault();
            dispatch(addItem(itemProps))
            closeModal();
        }
    }
}

const AddItemContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddItem)

export default AddItemContainer
