import CurrencyTextField from "../CurrencyTextField";
import {
    Button,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    Switch,
    TextField
} from "@material-ui/core";
import React, {useContext, useEffect} from "react";
import LoadingModalContext from "../../context/LoadingModalContext";
import MessageModalContext from "../../context/MessageModalContext";
import {accountService} from "../../api/account.service";
import {DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import RepeatFrequencies from "./RepeatFrequencies";
import {moneyFormat} from "../../utils/utils";
import moment from "moment";
import DeleteIcon from "@material-ui/icons/Delete";
import {scheduledTransferService} from "../../api/scheduled.transfers.service";

const useStyles = makeStyles(theme => ({
    formField: {
        marginBottom: theme.spacing(3)
    }
}));

const ScheduledTransferForm = (props) => {
    const {formik, history, mode, scheduledTransferId} = props;

    const toggleLoadingModalOpen = useContext(LoadingModalContext);
    const {showMessageModal} = useContext(MessageModalContext);

    const [accounts, setAccounts] = React.useState([]);

    const classes = useStyles();

    const onDeleteScheduledTransfer = async () => {
        try {
            toggleLoadingModalOpen();
            await scheduledTransferService.deleteScheduledTransferById(scheduledTransferId);
            toggleLoadingModalOpen();
            history.push(`/scheduled-transactions`);
        } catch (e) {
            if (e.response && e.response.status === 401) {
                history.push('/');
            }

            toggleLoadingModalOpen();
            showMessageModal('Error', 'An error occurred while processing your request, please try again.');
        }
    };

    useEffect(() => {
        (async function loadInitialData() {
            try {
                toggleLoadingModalOpen();
                const accounts = await accountService.getAllAccounts();
                setAccounts(accounts.data);

                if (mode === 'edit') {
                    const scheduledTransfer = await scheduledTransferService.getScheduledTransferById(scheduledTransferId);

                    await formik.setFieldValue('originAccountId', scheduledTransfer.data.origin_account_id);
                    await formik.setFieldValue('destinationAccountId', scheduledTransfer.data.destination_account_id);
                    await formik.setFieldValue('value', moneyFormat(scheduledTransfer.data.value, true));
                    await formik.setFieldValue('description', scheduledTransfer.data.description);
                    await formik.setFieldValue('createdDate', moment(scheduledTransfer.data.created_date));
                    await formik.setFieldValue('repeat', scheduledTransfer.data.repeat);

                    if (scheduledTransfer.data.repeat === true) {
                        await formik.setFieldValue('repeatFreq', scheduledTransfer.data.repeat_freq);
                        await formik.setFieldValue('repeatInterval', scheduledTransfer.data.repeat_interval);
                        await formik.setFieldValue('infiniteRepeat', scheduledTransfer.data.infinite_repeat);

                        if (scheduledTransfer.data.infinite_repeat === false) {
                            await formik.setFieldValue('endAfterRepeats', scheduledTransfer.data.end_after_repeats);
                        }
                    }
                }

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
                    textAlign='left'
                    label='Value'
                    variant='outlined'
                    currencySymbol="$"
                    outputFormat='number'
                    autoComplete='off'
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
                        value={formik.values.createdDate}
                        onChange={e => {
                            formik.setFieldValue('createdDate', e.format('yyyy-MM-DDTHH:mm:ss'))
                        }}
                        error={formik.touched.createdDate && Boolean(formik.errors.createdDate)}
                        helperText={formik.touched.createdDate && formik.errors.createdDate}
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
            <FormControl
                fullWidth
                variant='outlined'
                className={classes.formField}
                error={formik.touched.repeat && Boolean(formik.errors.repeat)}
            >
                <FormControlLabel
                    control={
                        <Switch
                            checked={formik.values.repeat}
                            onChange={formik.handleChange}
                            name='repeat'
                            id='repeat'
                            color='primary'
                        />
                    }
                    label="Repeat"
                />
            </FormControl>
            <FormControl
                fullWidth
                variant='outlined'
                className={classes.formField}
                error={formik.touched.repeatFreq && Boolean(formik.errors.repeatFreq)}
                disabled={formik.values.repeat === false}
            >
                <InputLabel>Frequency</InputLabel>
                <Select
                    id='repeatFreq'
                    name='repeatFreq'
                    label='Frequency'
                    value={formik.values.repeatFreq}
                    onChange={formik.handleChange}
                >
                    <MenuItem value=''><em>Select...</em></MenuItem>
                    <MenuItem value={RepeatFrequencies.DAYS}>Days</MenuItem>
                    <MenuItem value={RepeatFrequencies.WEEKS}>Weeks</MenuItem>
                    <MenuItem value={RepeatFrequencies.MONTHS}>Months</MenuItem>
                    <MenuItem value={RepeatFrequencies.YEARS}>Years</MenuItem>
                </Select>
                <FormHelperText>{formik.touched.repeatFreq && formik.errors.repeatFreq}</FormHelperText>
            </FormControl>
            <TextField
                id='repeatInterval'
                name='repeatInterval'
                fullWidth
                label='Interval'
                variant='outlined'
                autoComplete='off'
                className={classes.formField}
                value={formik.values.repeatInterval}
                onChange={formik.handleChange}
                error={formik.touched.repeatInterval && Boolean(formik.errors.repeatInterval)}
                helperText={formik.touched.repeatInterval && formik.errors.repeatInterval}
                type='number'
                disabled={formik.values.repeat === false}
            />
            <FormControl
                fullWidth
                variant='outlined'
                className={classes.formField}
                error={formik.touched.infiniteRepeat && Boolean(formik.errors.infiniteRepeat)}
                disabled={formik.values.repeat === false}
            >
                <FormControlLabel
                    control={
                        <Switch
                            checked={formik.values.infiniteRepeat}
                            onChange={formik.handleChange}
                            name='infiniteRepeat'
                            id='infiniteRepeat'
                            color='primary'
                        />
                    }
                    label="Infinite Repeat"
                />
            </FormControl>
            <TextField
                id='endAfterRepeats'
                name='endAfterRepeats'
                fullWidth
                label='End After Repetitions'
                variant='outlined'
                autoComplete='off'
                className={classes.formField}
                value={formik.values.endAfterRepeats}
                onChange={formik.handleChange}
                error={formik.touched.endAfterRepeats && Boolean(formik.errors.endAfterRepeats)}
                helperText={formik.touched.endAfterRepeats && formik.errors.endAfterRepeats}
                type='number'
                disabled={formik.values.repeat === false || formik.values.infiniteRepeat === true}
            />
            {
                mode === 'edit' ? <Button
                    fullWidth
                    variant='contained'
                    color='secondary'
                    startIcon={<DeleteIcon/>}
                    size='large'
                    onClick={onDeleteScheduledTransfer}
                >
                    Delete
                </Button> : <></>
            }
        </>
    );
};

export default ScheduledTransferForm;