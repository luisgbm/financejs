import React from 'react';
import DoneIcon from '@material-ui/icons/Done';
import {AppBar, Container, IconButton, TextField, Toolbar, Typography} from '@material-ui/core';
import LoadingModal from "../LoadingModal";
import {accountService} from "../../api/account.service";

class NewAccount extends React.Component {
    state = {accountName: '', showLoadingModal: false};

    constructor(props) {
        super(props);

        this.onNewAccount = this.onNewAccount.bind(this);
    }

    async onNewAccount() {
        try {
            this.setState({showLoadingModal: true});

            await accountService.newAccount(this.state.accountName);

            this.setState({showLoadingModal: false});

            this.props.history.push('/accounts');
        } catch (e) {
            if (e.response.status === 401) {
                this.props.history.push('/');
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <LoadingModal
                    show={this.state.showLoadingModal}
                />
                <AppBar position='sticky'>
                    <Toolbar>
                        <Typography variant='h6' className='appBarTitle'>New Account</Typography>
                        <IconButton color='inherit' onClick={this.onNewAccount}>
                            <DoneIcon/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Container maxWidth='sm' style={{paddingTop: '16px'}}>
                    <TextField
                        label='Account Name'
                        variant='outlined'
                        style={{width: '100%'}}
                        value={this.state.accountName}
                        onChange={event => this.setState({accountName: event.target.value})}
                    />
                </Container>
            </React.Fragment>
        );
    }
}

export default NewAccount;
