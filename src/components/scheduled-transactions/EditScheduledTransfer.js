import React, {useContext} from "react";
import LoadingModalContext from "../../context/LoadingModalContext";
import MessageModalContext from "../../context/MessageModalContext";
import {Container, IconButton, makeStyles} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import DoneIcon from "@material-ui/icons/Done";
import ScheduledTransferForm from "./ScheduledTransferForm";
import {useFormik} from "formik";
import {scheduledTransferInitialValues, scheduledTransferValidationSchema} from "./ScheduledTransferFormParams";
import {scheduledTransferService} from "../../api/scheduled.transfers.service";
import moment from "moment";
import {useDispatch} from "react-redux";

const useStyles = makeStyles(theme => ({
    appBarTitle: {
        flexGrow: 1
    },
    container: {
        padding: theme.spacing(3)
    }
}));

const EditScheduledTransfer = (props) => {
    const {scheduledTransferId} = props.match.params;

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

                const scheduledTransfer = await scheduledTransferService.editScheduledTransferById(
                    scheduledTransferId,
                    parseInt(originAccountId),
                    parseInt(destinationAccountId),
                    parseInt(value.replaceAll('.', '').replaceAll(',', '')),
                    description,
                    moment(createdDate).format('yyyy-MM-DDTHH:mm:ss'),
                    repeat,
                    repeatFreq,
                    parseInt(repeatInterval),
                    infiniteRepeat,
                    parseInt(endAfterRepeats)
                );

                dispatch({type: 'editScheduledTransaction', payload: scheduledTransfer});

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
                    <Typography variant='h6' className={classes.appBarTitle}>Edit Scheduled Transfer</Typography>
                    <IconButton color='inherit'
                                onClick={formikScheduledTransfer.handleSubmit}>
                        <DoneIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container maxWidth='sm' className={classes.container}>
                <ScheduledTransferForm
                    history={props.history}
                    formik={formikScheduledTransfer}
                    mode='edit'
                    scheduledTransferId={scheduledTransferId}
                />
            </Container>
        </>
    );
};

export default EditScheduledTransfer;