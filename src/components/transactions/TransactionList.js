import React from 'react';

import {Link} from 'react-router-dom'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import {Add} from '@material-ui/icons';
import {Card, CardHeader, Chip, Container, IconButton} from '@material-ui/core';
import CreateIcon from "@material-ui/icons/Create";
import {withStyles} from "@material-ui/core/styles";
import moment from 'moment';
import LoadingModal from "../LoadingModal";
import {transactionService} from "../../api/transaction.service";
import {accountService} from "../../api/account.service";

const styles = theme => ({
    card: {
        margin: theme.spacing(2)
    },
    green: {
        color: 'green'
    },
    red: {
        color: 'red'
    }
});

class TransactionList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accountId: props.match.params.accountId,
            accountName: 'Loading...',
            transactions: [],
            accountBalance: 0,
            showLoadingModal: true
        };
    }

    async componentDidMount() {
        try {
            const transactions = await transactionService.getAllTransactionsForAccountId(this.state.accountId);
            const account = await accountService.getAccountById(this.state.accountId);

            this.setState({
                transactions: transactions.data,
                accountName: account.data.name,
                accountBalance: account.data.balance,
                showLoadingModal: false
            });
        } catch (e) {
            if (e.response.status === 401) {
                this.props.history.push('/');
            }
        }
    }

    render() {
        const {classes} = this.props;

        return (
            <React.Fragment>
                <LoadingModal
                    show={this.state.showLoadingModal}
                />
                <AppBar position='sticky'>
                    <Toolbar>
                        <Typography variant='h6' className='appBarTitle'>{this.state.accountName} <Chip
                            label={this.state.accountBalance}/></Typography>
                        <IconButton color='inherit' component={Link}
                                    to={`/transactions/account/${this.state.accountId}/new`}>
                            <Add/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Container maxWidth='sm' style={{paddingTop: '16px'}}>
                    {
                        this.state.transactions.map(transaction =>
                            <Card key={transaction.id} className={classes.card} variant='outlined'>
                                <CardHeader
                                    action={
                                        <IconButton component={Link} to={`/transactions/${transaction.id}`}>
                                            <CreateIcon/>
                                        </IconButton>
                                    }
                                    title={
                                        <Typography variant='h6'
                                                    className={transaction.category_type === 'Expense' ? classes.red : classes.green}>
                                            {transaction.value}
                                        </Typography>
                                    }
                                    subheader={
                                        <React.Fragment>
                                            <b>Description:</b> {transaction.description}
                                            <br/>
                                            <b>Category:</b> {transaction.category_name} ({transaction.category_type})
                                            <br/>
                                            <b>Date:</b> {moment(transaction.date).format('DD/MM/YYYY HH:mm')}
                                        </React.Fragment>
                                    }
                                />
                            </Card>
                        )
                    }
                </Container>
            </React.Fragment>
        );
    }
}

export default withStyles(styles, {withTheme: true})(TransactionList);
