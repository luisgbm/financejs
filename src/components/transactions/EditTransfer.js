import React from 'react';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import SaveIcon from '@material-ui/icons/Save';
import {Button, Container, IconButton} from '@material-ui/core';
import moment from 'moment';
import DeleteIcon from '@material-ui/icons/Delete';
import LoadingModal from "../LoadingModal";
import {transferService} from "../../api/transfer.service";
import {accountService} from "../../api/account.service";
import TransferForm from "./TransferForm";

class EditTransfer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            transferId: this.props.match.params.transferId,
            fromAccountId: this.props.match.params.fromAccountId,
            value: 0,
            description: '',
            accounts: [],
            date: moment(),
            showLoadingModal: true,
            from: 0,
            to: 0,
            fromAccounts: [],
            toAccounts: []
        };

        this.onEditTransfer = this.onEditTransfer.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onDeleteTransfer = this.onDeleteTransfer.bind(this);
    }

    async onDeleteTransfer() {
        try {
            this.setState({showLoadingModal: true});

            await transferService.deleteTransferById(this.state.transferId);

            this.setState({showLoadingModal: false});

            this.props.history.push(`/transactions/account/${this.state.fromAccountId}`);
        } catch (e) {
            if (e.response.status === 401) {
                this.props.history.push('/');
            }
        }
    }

    async componentDidMount() {
        try {
            const transfer = await transferService.getTransferById(this.state.transferId);

            this.setState({
                value: transfer.data.value,
                description: transfer.data.description,
                date: moment(transfer.data.date),
                from: transfer.data.origin_account,
                to: transfer.data.destination_account
            });

            const accounts = await accountService.getAllAccounts();

            this.setState({
                accounts: accounts.data,
                fromAccounts: accounts.data,
                toAccounts: accounts.data,
                showLoadingModal: false
            });
        } catch (e) {
            if (e.response.status === 401) {
                this.props.history.push('/');
            }
        }
    }

    async onEditTransfer() {
        try {
            this.setState({showLoadingModal: true});

            await transferService.editTransferById(
                this.state.transferId,
                parseInt(this.state.value),
                this.state.description,
                this.state.date.format('YYYY-MM-DDTHH:mm:ss'),
                this.state.from,
                this.state.to
            );

            this.setState({showLoadingModal: false});

            this.props.history.push(`/transactions/account/${this.state.fromAccountId}`);
        } catch (e) {
            if (e.response.status === 401) {
                this.props.history.push('/');
            }
        }
    }

    async onChange(fieldName, fieldValue) {
        this.setState({[fieldName]: fieldValue});
    }

    render() {
        return (
            <React.Fragment>
                <LoadingModal
                    show={this.state.showLoadingModal}
                />
                <AppBar position='sticky'>
                    <Toolbar>
                        <Typography variant='h6' className='appBarTitle'>Edit Transfer</Typography>
                        <IconButton color='inherit' onClick={this.onEditTransfer}>
                            <SaveIcon/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Container maxWidth='sm' style={{paddingTop: '16px'}}>
                    <TransferForm
                        value={this.state.value}
                        description={this.state.description}
                        from={this.state.from}
                        to={this.state.to}
                        date={this.state.date}
                        fromAccounts={this.state.fromAccounts}
                        toAccounts={this.state.toAccounts}
                        onChange={this.onChange}
                    />
                    <Button
                        variant='contained'
                        color='secondary'
                        startIcon={<DeleteIcon/>}
                        size='large'
                        style={{width: '100%'}}
                        onClick={this.onDeleteTransfer}
                    >
                        Delete
                    </Button>
                </Container>
            </React.Fragment>
        );
    }
}

export default EditTransfer;
