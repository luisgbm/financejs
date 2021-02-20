import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {Container, IconButton, makeStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import {Add} from "@material-ui/icons";
import React, {useContext, useEffect} from "react";
import {scheduledTransactionService} from "../../api/scheduled.transactions.service";
import ScheduledTransactionCard from "./ScheduledTransactionCard";
import LoadingModalContext from "../../context/LoadingModalContext";
import MessageModalContext from "../../context/MessageModalContext";
import moment from "moment";

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

const ScheduledTransactionsList = (props) => {
    const toggleLoadingModalOpen = useContext(LoadingModalContext);
    const {showMessageModal} = useContext(MessageModalContext);

    const [grouped, setGrouped] = React.useState({});

    const classes = useStyles();

    const groupScheduledTransactionsByDate = (scheduledTransactions) => {
        for (let t of scheduledTransactions) {
            let nextDate = moment(t.next_date).format("DD/MM/yyyy");

            if (!grouped[nextDate]) {
                grouped[nextDate] = [];
            }

            grouped[nextDate].push(t);
        }

        setGrouped(grouped);
    };

    useEffect(() => {
        (async function loadScheduledTransactions() {
            try {
                toggleLoadingModalOpen();
                const scheduledTransactions = await scheduledTransactionService.getAllScheduledTransactions();
                groupScheduledTransactionsByDate(scheduledTransactions.data);
                toggleLoadingModalOpen();
            } catch (e) {
                if (e.response && e.response.status === 401) {
                    props.history.push('/')
                }

                toggleLoadingModalOpen();
                showMessageModal('Error', 'An error occurred while processing your request, please try again.');
            }
        })();
        // eslint-disable-next-line
    }, []);

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
                    Object.keys(grouped).sort().map(g =>
                        <>
                            <Typography key={g} variant='h6' className={classes.date}>{g}</Typography>
                            {
                                grouped[g].map(t =>
                                    <ScheduledTransactionCard
                                        key={t.id}
                                        scheduledTransaction={t}
                                    />
                                )
                            }
                        </>
                    )
                }
            </Container>
        </>
    );
};

export default ScheduledTransactionsList;