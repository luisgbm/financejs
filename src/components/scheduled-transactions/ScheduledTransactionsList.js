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

const useStyles = makeStyles(theme => ({
    appBarTitle: {
        flexGrow: 1
    },
    container: {
        padding: theme.spacing(3)
    }
}));

const ScheduledTransactionsList = (props) => {
    const toggleLoadingModalOpen = useContext(LoadingModalContext);
    const {showMessageModal} = useContext(MessageModalContext);

    const [scheduledTransactions, setScheduledTransactions] = React.useState([])

    const classes = useStyles();

    useEffect(() => {
        (async function loadScheduledTransactions() {
            try {
                toggleLoadingModalOpen();
                const scheduledTransactions = await scheduledTransactionService.getAllScheduledTransactions();
                setScheduledTransactions(scheduledTransactions.data);
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
                    scheduledTransactions.map(scheduledTransaction =>
                        <ScheduledTransactionCard
                            key={scheduledTransaction.id}
                            scheduledTransaction={scheduledTransaction}
                        />
                    )
                }
            </Container>
        </>
    );
};

export default ScheduledTransactionsList;