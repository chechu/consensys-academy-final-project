import React, { Component } from 'react';

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
            <span>
                Waiting for [{pendingTx.length}] transactions.
                <ul>
                    {pendingTx.map(tx => (
                        <PendingTx key={tx.txHash} {...tx} />
                    ))}
                </ul>
            </span>
        );
    }
}

const PendingTx = ({ txHash, expectedConfirmations }) => (
  <li>Waiting {expectedConfirmations} more confirmations for TX [{txHash}]</li>
)

export default ExpectingConfirmations;
