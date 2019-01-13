import { connect } from 'react-redux';
import AddSeller from './AddSeller';
import { addSeller } from './AddSellerActions';

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAddSellerClick: (event, targetAddress) => {
        event.preventDefault();
        dispatch(addSeller(targetAddress));
    }
  }
}

const AddSellerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddSeller)

export default AddSellerContainer
