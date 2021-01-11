import React from 'react';
import finance from '../../api/finance';

import {withStyles} from '@material-ui/core/styles';
import {Link} from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {Card, CardHeader, IconButton} from '@material-ui/core';
import {Add} from '@material-ui/icons';
import CreateIcon from "@material-ui/icons/Create";

const styles = theme => ({
    card: {
        margin: theme.spacing(2)
    }
});

class AccountList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            accounts: []
        };
    }

    async componentDidMount() {
        const accounts = await finance.get('/accounts');
        this.setState({accounts: accounts.data});
    }

    render() {
        const {classes} = this.props;

        return (
            <React.Fragment>
                <AppBar position='static'>
                    <Toolbar>
                        <Typography variant='h6' className='appBarTitle'>Accounts</Typography>
                        <IconButton color='inherit' component={Link} to={'/accounts/new'}>
                            <Add/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                {
                    this.state.accounts
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(account =>
                            <Card key={account.id} className={classes.card} variant='outlined'>
                                <CardHeader
                                    action={
                                        <IconButton component={Link} to={`/accounts/edit/${account.id}`}>
                                            <CreateIcon/>
                                        </IconButton>
                                    }
                                    title={
                                        <Link
                                            underline='none'
                                            to={`/transactions/account/${account.id}`}>
                                            <Typography variant='h6' style={{textDecoration: 'none'}}>
                                                {account.name}
                                            </Typography>
                                        </Link>
                                    }
                                    subheader={
                                        `Balance: ${account.balance}`
                                    }
                                />
                            </Card>
                        )
                }
            </React.Fragment>
        );
    }
}

export default withStyles(styles, {withTheme: true})(AccountList);
