import {FormControl, FormHelperText, InputLabel, makeStyles, MenuItem, Select, TextField} from "@material-ui/core";
import {DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import React, {useContext, useEffect} from "react";
import moment from "moment";
import CurrencyTextField from "../CurrencyTextField";
import {moneyFormat} from "../../utils/utils";
import LoadingModalContext from "../../context/LoadingModalContext";
import MessageModalContext from "../../context/MessageModalContext";
import {useSelector} from "react-redux";

const useStyles = makeStyles(theme => ({
    formField: {
        marginBottom: theme.spacing(3)
    }
}));

const PayScheduledTransferForm = (props) => {
    const {formik, history} = props;
    const scheduledTransferId = parseInt(props.scheduledTransferId);
    const allscheduledTransactions = useSelector(state => state.scheduledTransactions);

    const toggleLoadingModalOpen = useContext(LoadingModalContext);
    const {showMessageModal} = useContext(MessageModalContext);

    const accounts = useSelector(state => state.accounts);

    const classes = useStyles();

    useEffect(() => {
        (async function loadInitialData() {
            try {
                toggleLoadingModalOpen();

                const scheduledTransaction = allscheduledTransactions.find(scheduledTransaction => scheduledTransaction.id === scheduledTransferId);

                await formik.setFieldValue('originAccountId', scheduledTransaction.origin_account_id);
                await formik.setFieldValue('destinationAccountId', scheduledTransaction.destination_account_id);
                await formik.setFieldValue('value', moneyFormat(scheduledTransaction.value, true));
                await formik.setFieldValue('description', scheduledTransaction.description);
                await formik.setFieldValue('date', moment(scheduledTransaction.next_date));

                toggleLoadingModalOpen();
            } catch (e) {
                if (e.response && e.response.status === 401) {
                    history.push('/')
                }

                toggleLoadingModalOpen();
                showMessageModal('Error', 'An error occurred while processing your request, please try again.');
            }
        })()
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <FormControl
                fullWidth
                className={classes.formField}
            >
                <CurrencyTextField
                    id='value'
                    name='value'
                    label='Value'
                    variant='outlined'
                    autoComplete='off'
                    customInput={TextField}
                    value={formik.values.value}
                    onChange={formik.handleChange}
                    helperText={formik.touched.value && formik.errors.value}
                    error={formik.touched.value && Boolean(formik.errors.value)}
                />
            </FormControl>
            <FormControl
                fullWidth
                variant='outlined'
                className={classes.formField}
                error={formik.touched.destinationAccountId && Boolean(formik.errors.destinationAccountId)}
            >
                <InputLabel>To</InputLabel>
                <Select
                    id='destinationAccountId'
                    name='destinationAccountId'
                    label='To'
                    value={formik.values.destinationAccountId}
                    onChange={formik.handleChange}
                >
                    {
                        accounts.map(account =>
                            <MenuItem value={account.id} key={account.id}>{account.name}</MenuItem>
                        )
                    }
                </Select>
                <FormHelperText>{formik.touched.destinationAccountId && formik.errors.destinationAccountId}</FormHelperText>
            </FormControl>
            <FormControl
                fullWidth
                variant='outlined'
                className={classes.formField}
                error={formik.touched.originAccountId && Boolean(formik.errors.originAccountId)}
            >
                <InputLabel>From</InputLabel>
                <Select
                    id='originAccountId'
                    name='originAccountId'
                    label='From'
                    value={formik.values.originAccountId}
                    onChange={formik.handleChange}
                >
                    {
                        accounts.map(account =>
                            <MenuItem value={account.id} key={account.id}>{account.name}</MenuItem>
                        )
                    }
                </Select>
                <FormHelperText>{formik.touched.originAccountId && formik.errors.originAccountId}</FormHelperText>
            </FormControl>
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <FormControl
                    fullWidth
                    className={classes.formField}
                >
                    <DateTimePicker
                        label='Date/Time'
                        inputVariant='outlined'
                        value={formik.values.date}
                        onChange={e => {
                            formik.setFieldValue('date', e.format('yyyy-MM-DDTHH:mm:ss'))
                        }}
                        error={formik.touched.date && Boolean(formik.errors.date)}
                        helperText={formik.touched.date && formik.errors.date}
                        format='DD/MM/yyyy HH:mm'
                    />
                </FormControl>
            </MuiPickersUtilsProvider>
            <TextField
                id='description'
                name='description'
                fullWidth
                label='Description'
                variant='outlined'
                autoComplete='off'
                className={classes.formField}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
            />
        </>
    );
};

export default PayScheduledTransferForm;