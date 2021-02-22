import React, {useContext} from 'react';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import {Container, IconButton, makeStyles, Tab, Tabs} from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import moment from 'moment';
import {transactionService} from "../../api/transaction.service";
import AutorenewIcon from '@material-ui/icons/Autorenew';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import {useFormik} from "formik";
import * as yup from "yup";
import TransactionForm from "./TransactionForm";
import TransferForm from "./TransferForm";
import {transferService} from "../../api/transfer.service";
import LoadingModalContext from "../../context/LoadingModalContext";
import MessageModalContext from "../../context/MessageModalContext";
import {useDispatch} from "react-redux";
import {accountService} from "../../api/account.service";

const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing(3)
    },
    appBarTitle: {
        flexGrow: 1
    }
}));

const NewTransaction = (props) => {
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

    const currentTab = tabNameToValue(props.match.params.type);
    const accountId = parseInt(props.match.params.accountId);

    const toggleLoadingModalOpen = useContext(LoadingModalContext);
    const {showMessageModal} = useContext(MessageModalContext);

    const classes = useStyles();
    const dispatch = useDispatch();

    const formikTransaction = useFormik({
        initialValues: {
            value: '',
            description: '',
            accountId: accountId,
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

                await transactionService.newTransaction(
                    accountId,
                    parseInt(value.replaceAll('.', '').replaceAll(',', '')),
                    description,
                    date.format('yyyy-MM-DDTHH:mm:ss'),
                    parseInt(categoryId)
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

    const formikTransfer = useFormik({
        initialValues: {
            value: '',
            fromAccountId: accountId,
            toAccountId: '',
            description: '',
            date: moment()

        },
        validationSchema: yup.object({
            value: yup
                .string('Enter the value')
                .required('Value is required'),
            fromAccountId: yup
                .string('Select the From account')
                .required('From account is required'),
            toAccountId: yup
                .string('Select the To account')
                .test('differentFromAccountId', 'To and From must be different', function (value) {
                    return value !== this.options.parent.fromAccountId;
                })
                .required('To account is required')
        }),
        onSubmit: async (values) => {
            const {value, fromAccountId, toAccountId, description, date} = values;

            try {
                toggleLoadingModalOpen();

                await transferService.newTransfer(
                    parseInt(value.replaceAll('.', '').replaceAll(',', '')),
                    description,
                    fromAccountId,
                    toAccountId,
                    date.format('yyyy-MM-DDTHH:mm:ss'),
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

    const onChangeTab = (event, newValue) => {
        props.history.push(`/transactions/account/${accountId}/new/${tabValueToName(newValue)}`)
    };

    return (
        <>
            <AppBar position='sticky'>
                <Toolbar>
                    <Typography variant='h6' className={classes.appBarTitle}>New Transaction</Typography>
                    <IconButton color='inherit'
                                onClick={currentTab === 0 ? formikTransaction.handleSubmit : formikTransfer.handleSubmit}>
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
                    currentTab === 0 ? <TransactionForm history={props.history} formik={formikTransaction}/> :
                        <TransferForm history={props.history} formik={formikTransfer}/>
                }
            </Container>
        </>
    );
};

export default NewTransaction;
