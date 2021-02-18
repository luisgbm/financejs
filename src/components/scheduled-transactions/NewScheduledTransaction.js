import {Container, IconButton, makeStyles} from "@material-ui/core";
import React, {useContext} from "react";
import LoadingModalContext from "../../context/LoadingModalContext";
import MessageModalContext from "../../context/MessageModalContext";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import DoneIcon from "@material-ui/icons/Done";
import ScheduledTransactionForm from "./ScheduledTransactionForm";
import {useFormik} from "formik";
import {scheduledTransactionService} from "../../api/scheduled.transactions.service";
import {
    scheduledTransactionInitialValues,
    scheduledTransactionValidationSchema
} from "./ScheduledTransactionFormParams";

const useStyles = makeStyles(theme => ({
    appBarTitle: {
        flexGrow: 1
    },
    container: {
        padding: theme.spacing(3)
    }
}));

const NewScheduledTransaction = (props) => {
    const toggleLoadingModalOpen = useContext(LoadingModalContext);
    const {showMessageModal} = useContext(MessageModalContext);

    const classes = useStyles();

    const formikScheduledTransaction = useFormik({
        initialValues: scheduledTransactionInitialValues,
        validationSchema: scheduledTransactionValidationSchema,
        onSubmit: async (values) => {
            const {
                accountId,
                value,
                description,
                categoryId,
                createdDate,
                repeat,
                repeatFreq,
                repeatInterval,
                infiniteRepeat,
                endAfterRepeats
            } = values;

            try {
                toggleLoadingModalOpen();

                await scheduledTransactionService.newScheduledTransaction(
                    parseInt(accountId),
                    parseInt(value.replaceAll('.', '').replaceAll(',', '')),
                    description,
                    parseInt(categoryId),
                    createdDate.format('yyyy-MM-DDTHH:mm:ss'),
                    repeat,
                    repeatFreq,
                    parseInt(repeatInterval),
                    infiniteRepeat,
                    parseInt(endAfterRepeats)
                );

                toggleLoadingModalOpen();
                props.history.push(`/scheduled-transactions`);
            } catch (e) {
                if (e.response && e.response.status === 401) {
                    props.history.push('/');
                }

                toggleLoadingModalOpen();
                showMessageModal('Error', 'An error occurred while processing your request, please try again.');
            }
        },
    });

    return (
        <>
            <AppBar position='sticky'>
                <Toolbar>
                    <Typography variant='h6' className={classes.appBarTitle}>New Scheduled Transaction</Typography>
                    <IconButton color='inherit'
                                onClick={formikScheduledTransaction.handleSubmit}>
                        <DoneIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container maxWidth='sm' className={classes.container}>
                <ScheduledTransactionForm history={props.history} formik={formikScheduledTransaction}/>
            </Container>
        </>
    );
};

export default NewScheduledTransaction;