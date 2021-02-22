import React, {useContext, useEffect} from 'react';

import {Link} from 'react-router-dom'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import {Add} from '@material-ui/icons';
import {Chip, Container, IconButton, makeStyles} from '@material-ui/core';
import {transactionService} from "../../api/transaction.service";
import TransferCard from "./TransferCard";
import TransactionCard from "./TransactionCard";
import {moneyFormat} from "../../utils/utils";
import LoadingModalContext from "../../context/LoadingModalContext";
import MessageModalContext from "../../context/MessageModalContext";
import {useSelector} from "react-redux";

const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing(3)
    },
    appBarTitle: {
        flexGrow: 1
    }
}));

const TransactionList = (props) => {
    const accountId = parseInt(props.match.params.accountId);

    const accounts = useSelector(state => state.accounts);

    const toggleLoadingModalOpen = useContext(LoadingModalContext);
    const {showMessageModal} = useContext(MessageModalContext);

    const [transactions, setTransactions] = React.useState([]);
    const [accountName, setAccountName] = React.useState('');
    const [accountBalance, setAccountBalance] = React.useState(0);

    const classes = useStyles();

    useEffect(() => {
        (async function loadTransactionData() {
            try {
                toggleLoadingModalOpen();
                const transactions = await transactionService.getAllTransactionsForAccountId(accountId);

                const account = accounts.find(a => a.id === parseInt(accountId));

                setTransactions(transactions.data);
                setAccountName(account.name);
                setAccountBalance(moneyFormat(account.balance));
                toggleLoadingModalOpen();
            } catch (e) {
                if (e.response && e.response.status === 401) {
                    props.history.push('/')
                }

                toggleLoadingModalOpen();
                showMessageModal('Error', 'An error occurred while processing your request, please try again.');
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
