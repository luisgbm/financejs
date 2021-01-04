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
                        <li key={account.id}>{account.name} <Link to={`/edit-account/${account.id}`}>Edit</Link></li>
                    )
                }
                </ul>
                <Link to='/'>Home</Link>
                <Link to='/new-account'>New Account</Link>
            </div>
        );
    }
}

export default AccountList;
