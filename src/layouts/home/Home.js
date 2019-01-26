import React, { Component } from 'react';
import { Image, Container, Header, Grid, Icon } from 'semantic-ui-react';
import { CONTRACT_ADDRESS as marketplaceAddress } from '../../util/contracts/marketplace';
import { CONTRACT_ADDRESS as krakenAddress } from '../../util/contracts/krakenPriceTicker';

import appMarketplaceImage from '../../img/app-marketplace.png';

class Home extends Component {
    render() {
        return(
            <Container fluid>
                <Grid columns={2} verticalAlign='bottom' divided>
                    <Grid.Row>
                        <Grid.Column>
                            <Image src={appMarketplaceImage} size='big' floated='right' />
                        </Grid.Column>
                        <Grid.Column>
                            <Header as='h1' content='Daureos Marketplace' style={{ fontSize: '4em', fontWeight: 'normal', marginBottom: 0, marginTop: '4em' }} />
                            <Header as='h2' content='Final project for 2018 Developer Program - Ethereum Developer Bootcamp' style={{ fontSize: '1.7em', fontWeight: 'normal', marginTop: '1.5em' }} />
                            <Icon name='github' /><a href='https://github.com/chechu/consensys-academy-final-project'>https://github.com/chechu/consensys-academy-final-project</a>
                            <br/>
                            <Icon name='twitter' /><a href='https://twitter.com/daureos'>https://twitter.com/daureos</a>
                            <br/><br/>
                            <Icon name='ethereum' />Marketplace contract at: { marketplaceAddress }
                            <br/>
                            <Icon name='ethereum' />Kraken price ticker contract at: { krakenAddress }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        )
    }
}

export default Home;
