import React from 'react';
import { Confirm, Button } from 'semantic-ui-react';
import { getWeb3 } from '../../../util/connectors';

class Withdraw extends React.Component {

    constructor(props) {
        super(props);
        this.state = { open: false };
    }

    close = () => this.setState({ open: false })
    open = () => this.setState({ open: true })

    show = () => this.open()
    handleCancel = () => this.close()
    handleConfirm = () => this.props.onWithdrawFundsClick(this.props.sellerAddress, this.close)

    render() {
        const web3 = getWeb3();
        const BN = web3.utils.BN;

        const pendingFunds = this.props.pendingFunds ? web3.utils.fromWei(this.props.pendingFunds, 'finney') : 0;
        const confirmationMessage = `Do you want to withdraw ${pendingFunds} Finney to your account?`
        const disabled = new BN(this.props.pendingFunds).isZero();

        return(
            <div>
                <Button
                    disabled={disabled}
                    content='Withdraw' onClick={this.show} color='green'
                    icon='money bill alternate outline'
                    label={{ as: 'a', basic: true, pointing: 'right', content:`${pendingFunds} Finney` }}
                    labelPosition='left'
                />
                <Confirm
                    content={confirmationMessage}
                    open={this.state.open}
                    onCancel={this.handleCancel}
                    onConfirm={this.handleConfirm} />
            </div>
        )
    }
}

export default Withdraw
