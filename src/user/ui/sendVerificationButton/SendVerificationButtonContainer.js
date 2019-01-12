import { connect } from 'react-redux'
import SendVerificationButton from './SendVerificationButton'
import { sendVerification, sendTransaction } from './SendVerificationButtonActions'

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSendVerificationClick: (event) => {
      event.preventDefault();
      dispatch(sendVerification());
    },
    onSendTransactionClick: (event) => {
    	event.preventDefault();
    	dispatch(sendTransaction());
    }
  }
}

const SendVerificationButtonContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SendVerificationButton)

export default SendVerificationButtonContainer
