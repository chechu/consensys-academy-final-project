import { connect } from 'react-redux';
import AddAdmin from './AddAdmin';
import { addAdmin } from './AddAdminActions';

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAddAdminClick: (event, targetAddress) => {
        event.preventDefault();
        dispatch(addAdmin(targetAddress));
    }
  }
}

const AddAdminContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddAdmin)

export default AddAdminContainer
