import { connect } from 'react-redux';
import AddAdmin from './AddAdmin';
import { addAdmin } from './AddAdminActions';

const mapStateToProps = (state, ownProps) => {
    return {
        ensEnabled: state.tx.ensEnabled,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onAddAdminClick: (event, targetAddress, ensEnabled) => {
            event.preventDefault();
            dispatch(addAdmin(targetAddress, ensEnabled));
        }
    }
}

const AddAdminContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddAdmin)

export default AddAdminContainer
