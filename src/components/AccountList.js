import React from 'react';
import finance from '../api/finance';

class AccountList extends React.Component {
    state = { accounts: [] };

    async componentDidMount() {
        const response = await finance.get('/accounts');
        this.setState({ accounts: response.data} );
    }

    render() {
        return (
            this.state.accounts.map(account =>
                <li key={account.id}>{account.name}</li>
            )
        );
    }
}

export default AccountList;
