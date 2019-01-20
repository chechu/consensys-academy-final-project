import { connect } from 'react-redux'
import Footer from './Footer'

const mapStateToProps = (state, ownProps) => {
    return {
        address: state.user.data.address,
        roleName: state.user.data.role.name,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

const FooterContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Footer)

export default FooterContainer
