import React from 'react';
import {Link} from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {Container, IconButton, makeStyles} from '@material-ui/core';
import {Add} from '@material-ui/icons';
import AccountCard from "./AccountCard";
import {useSelector} from "react-redux";

const useStyles = makeStyles(theme => ({
    appBarTitle: {
        flexGrow: 1
    },
    container: {
        padding: theme.spacing(3)
    }
}));

const AccountList = (props) => {
    const accounts = useSelector(state => state.accounts);

    const classes = useStyles();

    return (
        <>
            <AppBar position='sticky'>
                <Toolbar>
                    <Typography variant='h6' className={classes.appBarTitle}>Accounts</Typography>
                    <IconButton color='inherit' component={Link} to={'/accounts/new'}>
                        <Add/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container maxWidth='sm' className={classes.container}>
                {
                    accounts
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(account =>
                            <AccountCard
                                key={account.id}
                                accountId={account.id}
                                accountName={account.name}
                                accountBalance={account.balance}
                            />
                        )
                }
            </Container>
        </>
    );
};

export default AccountList;
