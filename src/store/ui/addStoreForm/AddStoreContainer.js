import { connect } from 'react-redux';
import AddStore from './AddStore';
import { addStore } from './AddStoreActions';

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAddStoreClick: (event, targetAddress) => {
        event.preventDefault();
        dispatch(addStore(targetAddress));
    }
  }
}

const AddStoreContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddStore)

export default AddStoreContainer
