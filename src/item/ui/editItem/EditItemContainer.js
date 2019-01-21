import { connect } from 'react-redux'
import EditItem from './EditItem'
import { editItem } from './EditItemActions'

const mapStateToProps = (state, ownProps) => {
    return {
        authUserAddress: state.user.data && state.user.data.address,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onEditItemClick: (event, itemProps, closeModal) => {
            event.preventDefault();
            dispatch(editItem(itemProps))
            closeModal();
        }
    }
}

const EditItemContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EditItem)

export default EditItemContainer
