import React from 'react';
import {accountService} from '../../api/account.service';
import {withStyles} from '@material-ui/core/styles';
import {Link} from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {Card, CardHeader, Container, IconButton} from '@material-ui/core';
import {Add} from '@material-ui/icons';
import CreateIcon from "@material-ui/icons/Create";
import LoadingModal from "../LoadingModal";

const styles = () => ({
    green: {
        color: 'green'
    },
    red: {
        color: 'red'
    }
});

class AccountList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            accounts: [],
            showLoadingModal: true
        };
    }

    async componentDidMount() {
        try {
            const accounts = await accountService.getAllAccounts();

            this.setState({accounts: accounts.data, showLoadingModal: false});
        } catch (e) {
            if (e.response.status === 401) {
                this.props.history.push('/');
            }
        }
    }

    render() {
        const {classes} = this.props;

        return (
            <React.Fragment>
                <LoadingModal
                    show={this.state.showLoadingModal}
                />
                <AppBar position='sticky'>
                    <Toolbar>
                        <Typography variant='h6' className='appBarTitle'>Accounts</Typography>
                        <IconButton color='inherit' component={Link} to={'/accounts/new'}>
                            <Add/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Container maxWidth='sm' style={{paddingTop: '16px'}}>
                    {
                        this.state.accounts
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map(account =>
                                <Card key={account.id} variant='outlined' style={{marginBottom: '16px'}}>
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
                                            <React.Fragment>
                                                Balance: <span
                                                className={account.balance >= 0 ? classes.green : classes.red}>{account.balance}</span>
                                            </React.Fragment>
                                        }
                                    />
                                </Card>
                            )
                    }
                </Container>
            </React.Fragment>
        );
    }
}

export default withStyles(styles, {withTheme: true})(AccountList);
