import React from 'react';
import finance from '../../api/finance';

import {Link} from 'react-router-dom'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import {Add} from '@material-ui/icons';
import {IconButton} from '@material-ui/core';

class TransactionList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {accountId: props.match.params.accountId, accountName: '', transactions: [], accountBalance: 0};
    }

    async componentDidMount() {
        const transactions = await finance.get(`/transactions/account/${this.state.accountId}`);
        const account = await finance.get(`/accounts/${this.state.accountId}`);
        this.setState({
            transactions: transactions.data,
            accountName: account.data.name,
            accountBalance: account.data.balance
        });
    }

    render() {
        return (
            <React.Fragment>
                <AppBar position='sticky'>
                    <Toolbar>
                        <Typography variant='h6' className='appBarTitle'>{this.state.accountName}</Typography>
                        <IconButton color='inherit' component={Link}
                                    to={`/transactions/account/${this.state.accountId}/new`}>
                            <Add/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <p>Balance: {this.state.accountBalance}</p>
                <ul>
                    {
                        this.state.transactions.map(transaction =>
                            <li key={transaction.id}>
                                <b>Value:</b> {transaction.value}
                                <br/>
                                <b>Description:</b> {transaction.description}
                                <br/>
                                <b>Category:</b> {transaction.category_name} ({transaction.category_type})
                                <br/>
                                <b>Date:</b> {transaction.date}
                                <br/>
                                <Link to={`/transactions/${transaction.id}`}>Edit</Link>
                            </li>
                        )
                    }
                </ul>
            </React.Fragment>
        );
    }
}

export default TransactionList;
