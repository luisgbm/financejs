import {Container, IconButton, makeStyles, Tab, Tabs} from "@material-ui/core";
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
import {scheduledTransferInitialValues, scheduledTransferValidationSchema} from "./ScheduledTransferFormParams";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import ScheduledTransferForm from "./ScheduledTransferForm";
import moment from "moment";
import {useDispatch} from "react-redux";
import currency from "currency.js";

const useStyles = makeStyles(theme => ({
    appBarTitle: {
        flexGrow: 1
    },
    container: {
        padding: theme.spacing(3)
    }
}));

const NewScheduledTransaction = (props) => {
    const tabNameToValue = (tabName) => {
        let tabValue = 0;

        if (tabName) {
            if (tabName === 'transaction') {
                tabValue = 0;
            } else {
                tabValue = 1;
            }
        }

        return tabValue;
    };

    const tabValueToName = (tabValue) => {
        return tabValue === 0 ? 'transaction' : 'transfer';
    };

    const onChangeTab = (event, newValue) => {
        props.history.push(`/scheduled-transactions/new/${tabValueToName(newValue)}`)
    };

    const currentTab = tabNameToValue(props.match.params.type);

    const toggleLoadingModalOpen = useContext(LoadingModalContext);
    const {showMessageModal} = useContext(MessageModalContext);

    const classes = useStyles();
    const dispatch = useDispatch();

    const formikScheduledTransfer = useFormik({
        initialValues: scheduledTransferInitialValues,
        validationSchema: scheduledTransferValidationSchema,
        onSubmit: async (values) => {
            const {
                originAccountId,
                destinationAccountId,
                value,
                description,
                createdDate,
                repeat,
                repeatFreq,
                repeatInterval,
                infiniteRepeat,
                endAfterRepeats
            } = values;

            try {
                toggleLoadingModalOpen();

                let scheduledTransaction = await scheduledTransactionService.newScheduledTransaction(
                    'Transfer',
                    null,
                    currency(value).intValue,
                    description,
                    null,
                    parseInt(originAccountId),
                    parseInt(destinationAccountId),
                    moment(createdDate).format('yyyy-MM-DDTHH:mm:ss'),
                    repeat,
                    repeatFreq,
                    parseInt(repeatInterval),
                    infiniteRepeat,
                    parseInt(endAfterRepeats)
                );

                dispatch({type: 'addScheduledTransaction', payload: scheduledTransaction});

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

                let scheduledTransaction = await scheduledTransactionService.newScheduledTransaction(
                    'Transaction',
                    parseInt(accountId),
                    currency(value).intValue,
                    description,
                    parseInt(categoryId),
                    null,
                    null,
                    moment(createdDate).format('yyyy-MM-DDTHH:mm:ss'),
                    repeat,
                    repeatFreq,
                    parseInt(repeatInterval),
                    infiniteRepeat,
                    parseInt(endAfterRepeats)
                );

                dispatch({type: 'addScheduledTransaction', payload: scheduledTransaction});

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
                                onClick={currentTab === 0 ? formikScheduledTransaction.handleSubmit : formikScheduledTransfer.handleSubmit}>
                        <DoneIcon/>
                    </IconButton>
                </Toolbar>
                <Tabs value={currentTab} onChange={onChangeTab} centered>
                    <Tab icon={<AttachMoneyIcon/>} label='Regular'/>
                    <Tab icon={<AutorenewIcon/>} label='Transfer'/>
                </Tabs>
            </AppBar>
            <Container maxWidth='sm' className={classes.container}>
                {
                    currentTab === 0 ?
                        <ScheduledTransactionForm history={props.history} formik={formikScheduledTransaction}/> :
                        <ScheduledTransferForm history={props.history} formik={formikScheduledTransfer}/>
                }
            </Container>
        </>
    );
};

export default NewScheduledTransaction;