import React, {useEffect} from 'react';

import {Link} from 'react-router-dom'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import {Add} from '@material-ui/icons';
import {Chip, Container, IconButton, makeStyles} from '@material-ui/core';
import {transactionService} from "../../api/transaction.service";
import {accountService} from "../../api/account.service";
import MessageModal from "../MessageModal";
import LoadingModal from "../LoadingModal";
import TransferCard from "./TransferCard";
import TransactionCard from "./TransactionCard";
import {moneyFormat} from "../../utils/utils";

const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing(3)
    },
    appBarTitle: {
        flexGrow: 1
    }
}));

const TransactionList = (props) => {
    const {accountId} = props.match.params;

    const [transactions, setTransactions] = React.useState([]);
    const [accountName, setAccountName] = React.useState('');
    const [accountBalance, setAccountBalance] = React.useState(0);
    const [loadingModalOpen, setLoadingModalOpen] = React.useState(true);
    const [messageModalOpen, setMessageModalOpen] = React.useState(false);
    const [messageModalTitle, setMessageModalTitle] = React.useState('');
    const [messageModalMessage, setMessageModalMessage] = React.useState('');

    const classes = useStyles();

    useEffect(() => {
        (async function loadTransactionData() {
            try {
                const transactions = await transactionService.getAllTransactionsForAccountId(accountId);
                const account = await accountService.getAccountById(accountId);

                setTransactions(transactions.data);
                setAccountName(account.data.name);
                setAccountBalance(moneyFormat(account.data.balance));
                setLoadingModalOpen(false);
            } catch (e) {
                if (e.response && e.response.status === 401) {
                    props.history.push('/')
                }

                setLoadingModalOpen(false);

                setMessageModalTitle('Error');
                setMessageModalMessage('An error occurred while processing your request, please try again.');
                setMessageModalOpen(true);
            }
        })()
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const getCard = (transaction) => {
        if (transaction.category_type === 'TransferIncome' || transaction.category_type === 'TransferExpense') {
            return (
                <TransferCard
                    key={transaction.id}
                    transaction={transaction}
                    fromAccountId={accountId}
                />
            );
        } else {
            return (
                <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                />
            );
        }
    };

    return (
        <>
            <MessageModal
                open={messageModalOpen}
                title={messageModalTitle}
                message={messageModalMessage}
                handleClose={() => setMessageModalOpen(false)}
            />
            <LoadingModal open={loadingModalOpen}/>
            <AppBar position='sticky'>
                <Toolbar>
                    <Typography variant='h6' className={classes.appBarTitle}>{accountName} <Chip
                        label={accountBalance}/></Typography>
                    <IconButton
                        color='inherit'
                        component={Link}
                        to={`/transactions/account/${accountId}/new/transaction`}
                    >
                        <Add/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container maxWidth='sm' className={classes.container}>
                {
                    transactions.map(transaction =>
                        getCard(transaction)
                    )
                }
            </Container>
        </>
    );
};

export default TransactionList;
