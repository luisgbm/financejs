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
import moment from "moment";
import * as yup from "yup";
import {scheduledTransactionService} from "../../api/scheduled.transactions.service";

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
        initialValues: {
            value: '',
            description: '',
            accountId: '',
            categoryType: '',
            categoryId: '',
            createdDate: moment(),
            repeat: false,
            repeatFreq: '',
            repeatInterval: '',
            endAfterRepeats: ''

        },
        validationSchema: yup.object({
            accountId: yup
                .string('Select the account')
                .required('Account is required'),
            value: yup
                .string('Enter the value')
                .required('Value is required'),
            categoryType: yup
                .string('Select the category type')
                .required('Type is required'),
            categoryId: yup
                .string('Select the category')
                .required('Category is required'),
            repeat: yup
                .boolean(),
            repeatFreq: yup
                .string()
                .when('repeat', {
                    is: true,
                    then: yup.string().required('Frequency is required')
                }),
            repeatInterval: yup
                .string()
                .when('repeat', {
                    is: true,
                    then: yup.string().required('Interval is required')
                }),
            endAfterRepeats: yup
                .string()
                .when('repeat', {
                    is: true,
                    then: yup.string().required('End After Repetitions is required')
                })
        }),
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