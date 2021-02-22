import {Container, IconButton, makeStyles} from "@material-ui/core";
import {useFormik} from "formik";
import moment from "moment";
import * as yup from "yup";
import React, {useContext} from "react";
import LoadingModalContext from "../../context/LoadingModalContext";
import MessageModalContext from "../../context/MessageModalContext";
import {scheduledTransactionService} from "../../api/scheduled.transactions.service";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import SaveIcon from "@material-ui/icons/Save";
import AppBar from "@material-ui/core/AppBar";
import PayScheduledTransactionForm from "./PayScheduledTransactionForm";
import {accountService} from "../../api/account.service";
import {useDispatch} from "react-redux";

const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing(3)
    },
    appBarTitle: {
        flexGrow: 1
    }
}));

const PayScheduledTransaction = (props) => {
    const {scheduledTransactionId} = props.match.params;

    const toggleLoadingModalOpen = useContext(LoadingModalContext);
    const {showMessageModal} = useContext(MessageModalContext);

    const classes = useStyles();
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            value: '',
            description: '',
            accountId: '',
            categoryType: '',
            categoryId: '',
            date: moment()

        },
        validationSchema: yup.object({
            value: yup
                .string('Enter the value')
                .required('Value is required'),
            categoryType: yup
                .string('Select the category type')
                .required('Type is required'),
            categoryId: yup
                .string('Select the category')
                .required('Category is required')
        }),
        onSubmit: async (values) => {
            const {value, description, accountId, categoryId, date} = values;

            try {
                toggleLoadingModalOpen();

                await scheduledTransactionService.payScheduledTransaction(
                    scheduledTransactionId,
                    parseInt(value.replaceAll('.', '').replaceAll(',', '')),
                    description,
                    moment(date).format('YYYY-MM-DDTHH:mm:ss'),
                    parseInt(categoryId),
                    parseInt(accountId)
                );

                const accounts = await accountService.getAllAccounts();
                dispatch({type: 'setAccounts', payload: accounts});

                toggleLoadingModalOpen();
                props.history.push(`/transactions/account/${accountId}`);
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
                    <Typography variant='h6' className={classes.appBarTitle}>Pay Scheduled Transaction</Typography>
                    <IconButton color='inherit'
                                onClick={formik.handleSubmit}>
                        <SaveIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container maxWidth='sm' className={classes.container}>
                <PayScheduledTransactionForm
                    formik={formik}
                    scheduledTransactionId={scheduledTransactionId}
                />
            </Container>
        </>
    );
};

export default PayScheduledTransaction;