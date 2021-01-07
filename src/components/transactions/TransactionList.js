import React from 'react';
import finance from '../../api/finance';

import {Link} from 'react-router-dom'

class TransactionList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { accountId: props.match.params.accountId, accountName: '', transactions: [] };
    }

    async componentDidMount() {
        const transactions = await finance.get(`/transactions/account/${this.state.accountId}`);
        const account = await finance.get(`/accounts/${this.state.accountId}`);
        this.setState({ transactions: transactions.data, accountName: account.data.name });
    }

    render() {
        return (
            <div>
                <h1>Transactions - {this.state.accountName}</h1>
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
                <Link to={`/transactions/account/${this.state.accountId}/new`}>New Transaction</Link>
                <br />
                <Link to='/accounts'>Back</Link>
            </div>
        );
    }
}

export default TransactionList;
