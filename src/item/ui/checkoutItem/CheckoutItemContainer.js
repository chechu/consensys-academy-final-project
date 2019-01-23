import { connect } from 'react-redux'
import CheckoutItem from './CheckoutItem'
import { checkoutItem } from './CheckoutItemActions'

const mapStateToProps = (state, ownProps) => {
    return {
        buyerAddress: state.user.data.address,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onCheckoutItemClick: (event, numItemsToPurchase, closeModal) => {
            event.preventDefault();
            dispatch(checkoutItem(ownProps.item, numItemsToPurchase))
            closeModal();
        }
    }
}

const CheckoutItemContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CheckoutItem)

export default CheckoutItemContainer
