import React from 'react';
import finance from '../../api/finance';

import { Link } from 'react-router-dom'

class AccountList extends React.Component {
    state = { accounts: [] };

    async componentDidMount() {
        const response = await finance.get('/accounts');
        this.setState({ accounts: response.data} );
    }

    render() {
        return (
            <div>
                <h1>Accounts</h1>
                <ul>
                {
                    this.state.accounts.map(account =>
                        <li key={account.id}>
                            <Link to={`/transactions/account/${account.id}`}>{account.name}</Link> <Link to={`/accounts/edit/${account.id}`}>Edit</Link>
                        </li>
                    )
                }
                </ul>
                <Link to='/accounts/new'>New Account</Link>
                <br />
                <Link to='/'>Home</Link>
            </div>
        );
    }
}

export default AccountList;
