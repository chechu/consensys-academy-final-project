import { connect } from 'react-redux';
import ExpectingConfirmations from './ExpectingConfirmations';
import { confirmedTx } from './ExpectingConfirmationsActions';

const mapStateToProps = (state, ownProps) => {
    return {
        pendingTx: state.tx.pendingTx,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onFullyConfirmedTx: (txHash) => {
            dispatch(confirmedTx(txHash));
        }
    }
}

const ExpectingConfirmationsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ExpectingConfirmations);

export default ExpectingConfirmationsContainer;
