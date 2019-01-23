import { connect } from 'react-redux'
import WithdrawFunds from './WithdrawFunds'
import { withdrawFunds } from './WithdrawFundsActions'

const mapStateToProps = (state, ownProps) => {
    return {
        pendingFunds: state.user.pendingFunds,
        sellerAddress: state.user.data.address,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onWithdrawFundsClick: (sellerAddress, closeModal) => {
            dispatch(withdrawFunds(sellerAddress))
            closeModal();
        }
    }
}

const WithdrawFundsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(WithdrawFunds)

export default WithdrawFundsContainer
