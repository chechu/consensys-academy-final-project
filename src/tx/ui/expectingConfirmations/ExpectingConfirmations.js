import React, { Component } from 'react';
import { Segment, Header, List, Loader } from 'semantic-ui-react';

export const CONFIRMATIONS_THRESHOLD = 1;

class ExpectingConfirmations extends Component {
    render() {
        if (!this.props.pendingTx || !Object.keys(this.props.pendingTx).length) {
            return null;
        }

        const pendingTx = Object.keys(this.props.pendingTx).map((txHash) => {
            return {
                txHash,
                expectedConfirmations: this.props.pendingTx[txHash].expectedConfirmations,
            }
        });

        return (
            <Segment raised>
                <Header><Loader size='small' active inline /> Waiting for [{pendingTx.length}] transactions</Header>
                <List divided relaxed>
                    {pendingTx.map(tx => (
                        <PendingTx key={tx.txHash} {...tx} />
                    ))}
                </List>
            </Segment>
        );
    }
}

const PendingTx = ({ txHash, expectedConfirmations }) => (
    <List.Item key={txHash}>
        <List.Icon name='ethereum' size='large' verticalAlign='middle' />
        <List.Content>
            <List.Header as='a' target='_blank' href={'https://rinkeby.etherscan.io/tx/' + txHash}>{txHash}</List.Header>
            <List.Description as='a'>Waiting for {expectedConfirmations} confirmations more</List.Description>
        </List.Content>
    </List.Item>
)

export default ExpectingConfirmations;
