import React from 'react';
import { Label, Icon, Segment, Popup } from 'semantic-ui-react';
import ExpectingConfirmationsContainer from '../../../tx/ui/expectingConfirmations/ExpectingConfirmationsContainer';
import { getWeb3 } from '../../../util/connectors';

const Footer = ({ address, roleName, balance, pendingFunds, ETHPriceInUSD }) => {
    const size = 'large';
    return(
        <span>
            <Segment raised>
                <Label size={size} as='a' image color='grey' href={'https://rinkeby.etherscan.io/address/' + address}>
                    <Icon name='ethereum' />
                    Address
                    <Label.Detail>{address}</Label.Detail>
                </Label>
                <Label size={size} image color='grey'>
                    <Icon name='user' />
                    Role
                    <Label.Detail>{roleName}</Label.Detail>
                </Label>
                {
                    balance &&
                    <Label size={size} image color='grey'>
                        <Icon name='balance'/>
                        Balance
                        <Label.Detail>{parseFloat(getWeb3().utils.fromWei(balance, 'finney').toString()).toFixed(2)} Finney</Label.Detail>
                    </Label>
                }
                {
                    ETHPriceInUSD &&
                    <Label size={size} color='grey' image>
                        <Icon name='dollar sign'/>
                        ETH in USD
                        <Label.Detail>
                            <Popup trigger={<span>US$ {ETHPriceInUSD}</span>}>
                                <Popup.Header>Updated data</Popup.Header>
                                <Popup.Content>This data is provided by an integration with <a href='http://www.oraclize.it'>Oraclize</a></Popup.Content>
                            </Popup>
                        </Label.Detail>
                    </Label>
                }
            </Segment>
            <ExpectingConfirmationsContainer />
        </span>
    )
}

export default Footer
