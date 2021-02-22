import {Container, IconButton, makeStyles} from "@material-ui/core";
import {useFormik} from "formik";
import moment from "moment";
import * as yup from "yup";
import React, {useContext} from "react";
import LoadingModalContext from "../../context/LoadingModalContext";
import MessageModalContext from "../../context/MessageModalContext";
import {scheduledTransferService} from "../../api/scheduled.transfers.service";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import SaveIcon from "@material-ui/icons/Save";
import AppBar from "@material-ui/core/AppBar";
import PayScheduledTransferForm from "./PayScheduledTransferForm";
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

const PayScheduledTransfer = (props) => {
    const {scheduledTransferId} = props.match.params;

    const toggleLoadingModalOpen = useContext(LoadingModalContext);
    const {showMessageModal} = useContext(MessageModalContext);

    const classes = useStyles();
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            originAccountId: '',
            destinationAccountId: '',
            value: '',
            description: '',
            date: moment()

        },
        validationSchema: yup.object({
            value: yup
                .string('Enter the value')
                .required('Value is required'),
            originAccountId: yup
                .string('Select the From account')
                .required('From Account is required'),
            destinationAccountId: yup
                .string('Select the To account')
                .test('differentOriginAccountId', 'To and From must be different', function (value) {
                    return value !== this.options.parent.originAccountId;
                })
                .required('To Account is required'),
        }),
        onSubmit: async (values) => {
            const {originAccountId, destinationAccountId, value, description, date} = values;

            try {
                toggleLoadingModalOpen();

                await scheduledTransferService.payScheduledTransfer(
                    scheduledTransferId,
                    originAccountId,
                    destinationAccountId,
                    parseInt(value.replaceAll('.', '').replaceAll(',', '')),
                    description,
                    moment(date).format('YYYY-MM-DDTHH:mm:ss')
                );

                const accounts = await accountService.getAllAccounts();
                dispatch({type: 'setAccounts', payload: accounts});

                toggleLoadingModalOpen();
                props.history.push(`/transactions/account/${destinationAccountId}`);
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
                    <Typography variant='h6' className={classes.appBarTitle}>Pay Scheduled Transfer</Typography>
                    <IconButton color='inherit'
                                onClick={formik.handleSubmit}>
                        <SaveIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container maxWidth='sm' className={classes.container}>
                <PayScheduledTransferForm
                    formik={formik}
                    scheduledTransferId={scheduledTransferId}
                />
            </Container>
        </>
    );
};

export default PayScheduledTransfer;