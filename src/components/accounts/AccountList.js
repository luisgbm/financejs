import React, {useEffect} from 'react';
import {accountService} from '../../api/account.service';
import {Link} from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {Container, IconButton, makeStyles} from '@material-ui/core';
import {Add} from '@material-ui/icons';
import LoadingModal from "../LoadingModal";
import AccountCard from "./AccountCard";
import MessageModal from "../MessageModal";

const useStyles = makeStyles(theme => ({
    appBarTitle: {
        flexGrow: 1
    },
    container: {
        padding: theme.spacing(3)
    }
}));

const AccountList = (props) => {
    const [accounts, setAccounts] = React.useState([]);
    const [loadingModalOpen, setLoadingModalOpen] = React.useState(true);
    const [messageModalOpen, setMessageModalOpen] = React.useState(false);
    const [messageModalTitle, setMessageModalTitle] = React.useState('');
    const [messageModalMessage, setMessageModalMessage] = React.useState('');

    const classes = useStyles();

    useEffect(() => {
        (async function loadAccounts() {
            try {
                const accounts = await accountService.getAllAccounts();
                setAccounts(accounts.data);
                setLoadingModalOpen(false);
            } catch (e) {
                if (e.response && e.response.status === 401) {
                    props.history.push('/')
                }

                setLoadingModalOpen(false);

                setMessageModalTitle('Error');
                setMessageModalMessage('An error occurred while processing your request, please try again.');
                setMessageModalOpen(true);
            }
        })();
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <MessageModal
                open={messageModalOpen}
                title={messageModalTitle}
                message={messageModalMessage}
                handleClose={() => setMessageModalOpen(false)}
            />
            <LoadingModal
                open={loadingModalOpen}
            />
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
