import MessageModal from "../MessageModal";
import LoadingModal from "../LoadingModal";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {Container, IconButton, makeStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import {Add} from "@material-ui/icons";
import React, {useEffect} from "react";
import {scheduledTransactionService} from "../../api/scheduled.transactions.service";
import ScheduledTransactionCard from "./ScheduledTransactionCard";

const useStyles = makeStyles(theme => ({
    appBarTitle: {
        flexGrow: 1
    },
    container: {
        padding: theme.spacing(3)
    }
}));

const ScheduledTransactionsList = (props) => {
    const [scheduledTransactions, setScheduledTransactions] = React.useState([])
    const [loadingModalOpen, setLoadingModalOpen] = React.useState(true);
    const [messageModalOpen, setMessageModalOpen] = React.useState(false);
    const [messageModalTitle, setMessageModalTitle] = React.useState('');
    const [messageModalMessage, setMessageModalMessage] = React.useState('');

    const classes = useStyles();

    useEffect(() => {
        (async function loadScheduledTransactions() {
            try {
                const scheduledTransactions = await scheduledTransactionService.getAllScheduledTransactions();
                setScheduledTransactions(scheduledTransactions.data);
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
                    <Typography variant='h6' className={classes.appBarTitle}>Scheduled Transactions</Typography>
                    <IconButton color='inherit' component={Link} to={'/scheduled-transactions/new'}>
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