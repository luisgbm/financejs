import React from 'react';
import finance from '../../api/finance';

import {Link} from 'react-router-dom'

class AccountList extends React.Component {
    state = { accounts: [] };

    async componentDidMount() {
        const accounts = await finance.get('/accounts');
        this.setState({accounts: accounts.data});
    }

    render() {
        return (
            <div>
                <ul>
                {
                    this.state.accounts.map(account =>
                        <li key={account.id}>
                            <Link
                                to={`/transactions/account/${account.id}`}>{account.name}</Link> (Balance: {account.balance}) <Link
                            to={`/accounts/edit/${account.id}`}>Edit</Link>
                        </li>
                    )
                }
                </ul>
                <Link to='/accounts/new'>New Account</Link>
            </div>
        );
    }
}

export default AccountList;
