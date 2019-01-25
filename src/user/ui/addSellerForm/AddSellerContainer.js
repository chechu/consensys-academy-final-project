import { connect } from 'react-redux';
import AddSeller from './AddSeller';
import { addSeller } from './AddSellerActions';

const mapStateToProps = (state, ownProps) => {
    return {
        ensEnabled: state.tx.ensEnabled,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAddSellerClick: (event, targetAddress, ensEnabled) => {
           event.preventDefault();
           dispatch(addSeller(targetAddress, ensEnabled));
        }
    }
}

const AddSellerContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddSeller)

export default AddSellerContainer
