import React from 'react';
import finance from '../../api/finance';

import {Link} from 'react-router-dom'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import {Add} from '@material-ui/icons';
import {Card, CardHeader, Chip, IconButton} from '@material-ui/core';
import CreateIcon from "@material-ui/icons/Create";
import {withStyles} from "@material-ui/core/styles";
import moment from 'moment';

const styles = theme => ({
    card: {
        margin: theme.spacing(2)
    },
    green: {
        color: 'green'
    },
    red: {
        color: 'red'
    }
});

class TransactionList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {accountId: props.match.params.accountId, accountName: '', transactions: [], accountBalance: 0};
    }

    async componentDidMount() {
        const transactions = await finance.get(`/transactions/account/${this.state.accountId}`);
        const account = await finance.get(`/accounts/${this.state.accountId}`);
        this.setState({
            transactions: transactions.data,
            accountName: account.data.name,
            accountBalance: account.data.balance
        });
    }

    render() {
        const {classes} = this.props;

        return (
            <React.Fragment>
                <AppBar position='sticky'>
                    <Toolbar>
                        <Typography variant='h6' className='appBarTitle'>{this.state.accountName} <Chip
                            label={this.state.accountBalance}/></Typography>
                        <IconButton color='inherit' component={Link}
                                    to={`/transactions/account/${this.state.accountId}/new`}>
                            <Add/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                {
                    this.state.transactions.map(transaction =>
                        <Card key={transaction.id} className={classes.card} variant='outlined'>
                            <CardHeader
                                action={
                                    <IconButton component={Link} to={`/transactions/${transaction.id}`}>
                                        <CreateIcon/>
                                    </IconButton>
                                }
                                title={
                                    <Typography variant='h6'
                                                className={transaction.category_type === 'Expense' ? classes.red : classes.green}>
                                        {transaction.value}
                                    </Typography>
                                }
                                subheader={
                                    <React.Fragment>
                                        <b>Description:</b> {transaction.description}
                                        <br/>
                                        <b>Category:</b> {transaction.category_name} ({transaction.category_type})
                                        <br/>
                                        <b>Date:</b> {moment(transaction.date).format('DD/MM/YYYY hh:mm')}
                                    </React.Fragment>
                                }
                            />
                        </Card>
                    )
                }
            </React.Fragment>
        );
    }
}

export default withStyles(styles, {withTheme: true})(TransactionList);
