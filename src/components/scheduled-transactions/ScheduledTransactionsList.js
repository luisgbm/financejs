import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {Container, IconButton, makeStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import {Add} from "@material-ui/icons";
import React from "react";
import ScheduledTransactionCard from "./ScheduledTransactionCard";
import moment from "moment";
import {useSelector} from "react-redux";

const useStyles = makeStyles(theme => ({
    appBarTitle: {
        flexGrow: 1
    },
    container: {
        padding: theme.spacing(3)
    },
    date: {
        textAlign: 'center',
        color: 'grey',
        marginBottom: theme.spacing(1)
    }
}));

const ScheduledTransactionsList = () => {
    const scheduledTransactions = useSelector(state => {
        let grouped = {};

        let orderedByDate = state.scheduledTransactions.sort((a, b) => moment(a.next_date).diff(moment(b.next_date)));

        for (let t of orderedByDate) {
            let nextDate = moment(t.next_date).format("DD/MM/yyyy");

            if (!grouped[nextDate]) {
                grouped[nextDate] = [];
            }

            grouped[nextDate].push(t);
        }

        return grouped;
    });

    const dateIsToday = (date) => {
        let today = moment().format("DD/MM/yyyy");

        return today === date;
    };

    const classes = useStyles();

    return (
        <>
            <AppBar position='sticky'>
                <Toolbar>
                    <Typography variant='h6' className={classes.appBarTitle}>Scheduled Transactions</Typography>
                    <IconButton color='inherit' component={Link} to={'/scheduled-transactions/new/transaction'}>
                        <Add/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container maxWidth='sm' className={classes.container}>
                {
                    Object.keys(scheduledTransactions).map(date =>
                        <div key={date}>
                            <Typography key={date} variant='h6'
                                        className={classes.date}>{dateIsToday(date) ? 'Today' : date}</Typography>
                            {
                                scheduledTransactions[date].map(scheduledTransaction =>
                                    <ScheduledTransactionCard
                                        key={scheduledTransaction.id}
                                        scheduledTransaction={scheduledTransaction}
                                    />
                                )
                            }
                        </div>
                    )
                }
            </Container>
        </>
    );
};

export default ScheduledTransactionsList;