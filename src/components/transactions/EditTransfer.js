import React from 'react';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import SaveIcon from '@material-ui/icons/Save';
import {Container, IconButton, makeStyles} from '@material-ui/core';
import moment from 'moment';
import {transferService} from "../../api/transfer.service";
import MessageModal from "../MessageModal";
import LoadingModal from "../LoadingModal";
import {useFormik} from "formik";
import * as yup from "yup";
import TransferForm from "./TransferForm";

const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing(3)
    },
    appBarTitle: {
        flexGrow: 1
    }
}));

const EditTransfer = (props) => {
    const {transferId, fromAccountId} = props.match.params;

    const [loadingModalOpen, setLoadingModalOpen] = React.useState(false);
    const [messageModalOpen, setMessageModalOpen] = React.useState(false);
    const [messageModalTitle, setMessageModalTitle] = React.useState('');
    const [messageModalMessage, setMessageModalMessage] = React.useState('');

    const classes = useStyles();

    const formik = useFormik({
        initialValues: {
            value: '',
            fromAccountId: '',
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
                setLoadingModalOpen(true);

                await transferService.editTransferById(
                    transferId,
                    parseInt(value),
                    description,
                    moment(date).format('YYYY-MM-DDTHH:mm:ss'),
                    fromAccountId,
                    toAccountId
                );

                setLoadingModalOpen(false);
                props.history.push(`/transactions/account/${fromAccountId}`);
            } catch (e) {
                if (e.response && e.response.status === 401) {
                    props.history.push('/');
                }

                setLoadingModalOpen(false);

                setMessageModalTitle('Error');
                setMessageModalMessage('An error occurred while processing your request, please try again.');
                setMessageModalOpen(true);
            }
        },
    });

    return (
        <>
            <MessageModal
                open={messageModalOpen}
                title={messageModalTitle}
                message={messageModalMessage}
                handleClose={() => setMessageModalOpen(false)}
            />
            <LoadingModal open={loadingModalOpen}/>
            <AppBar position='sticky'>
                <Toolbar>
                    <Typography variant='h6' className={classes.appBarTitle}>Edit Transfer</Typography>
                    <IconButton color='inherit'
                                onClick={formik.handleSubmit}>
                        <SaveIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container maxWidth='sm' className={classes.container}>
                <TransferForm formik={formik} history={props.history} mode='edit' transferId={transferId}
                              fromAccountId={fromAccountId}/>
            </Container>
        </>
    );
};

export default EditTransfer;
