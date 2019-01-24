import { connect } from 'react-redux';
import SetEmergency from './SetEmergency';
import { toggleEmergency } from './SetEmergencyActions';

const mapStateToProps = (state, ownProps) => {
  return {
    isEmergency: state.user.isEmergency,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onToggleEmergencyClick: (event) => {
        event.preventDefault();
        dispatch(toggleEmergency());
    }
  }
}

const SetEmergencyContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SetEmergency)

export default SetEmergencyContainer
