import React from 'react';
import finance from '../../api/finance';

import {Link} from 'react-router-dom'
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

class AccountList extends React.Component {
    state = {accounts: []};

    async componentDidMount() {
        const accounts = await finance.get('/accounts');
        this.setState({accounts: accounts.data});
    }

    render() {
        return (
            <React.Fragment>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6">Finance</Typography>
                    </Toolbar>
                </AppBar>
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
            </React.Fragment>
        );
    }
}

export default AccountList;
