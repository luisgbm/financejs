import {
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    TextField
} from "@material-ui/core";
import {DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import React, {useContext, useEffect} from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import {transferService} from "../../api/transfer.service";
import moment from "moment";
import LoadingModalContext from "../../context/LoadingModalContext";
import MessageModalContext from "../../context/MessageModalContext";
import {useDispatch, useSelector} from "react-redux";
import {accountService} from "../../api/account.service";
import currency from 'currency.js';

const useStyles = makeStyles(theme => ({
    formField: {
        marginBottom: theme.spacing(3)
    }
}));

const TransferForm = (props) => {
    const accounts = useSelector(state => state.accounts);

    const toggleLoadingModalOpen = useContext(LoadingModalContext);
    const {showMessageModal} = useContext(MessageModalContext);

    const classes = useStyles();
    const dispatch = useDispatch();

    const {formik, history, mode, transferId, fromAccountId} = props;

    useEffect(() => {
        (async function loadInitialData() {
            try {
                toggleLoadingModalOpen();

                if (mode === 'edit') {
                    const transfer = await transferService.getTransferById(transferId);

                    formik.setFieldValue('value', currency(transfer.data.value, {fromCents: true}));
                    formik.setFieldValue('description', transfer.data.description);
                    formik.setFieldValue('date', moment(transfer.data.date));
                    formik.setFieldValue('fromAccountId', transfer.data.origin_account);
                    formik.setFieldValue('toAccountId', transfer.data.destination_account);
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

    const onDeleteTransfer = async () => {
        try {
            toggleLoadingModalOpen();

            await transferService.deleteTransferById(transferId);

            const accounts = await accountService.getAllAccounts();
            dispatch({type: 'setAccounts', payload: accounts});

            toggleLoadingModalOpen();

            history.push(`/transactions/account/${fromAccountId}`);
        } catch (e) {
            if (e.response && e.response.status === 401) {
                history.push('/');
            }

            toggleLoadingModalOpen();
            showMessageModal('Error', 'An error occurred while processing your request, please try again.');
        }
    };

    return (
        <>
            <TextField
                fullWidth
                id='value'
                name='value'
                label='Value'
                variant='outlined'
                autoComplete='off'
                className={classes.formField}
                type='number'
                value={formik.values.value}
                onChange={formik.handleChange}
                error={formik.touched.value && Boolean(formik.errors.value)}
                helperText={formik.touched.value && formik.errors.value}
            />
            <FormControl
                fullWidth
                variant='outlined'
                className={classes.formField}
                error={formik.touched.toAccountId && Boolean(formik.errors.toAccountId)}
            >
                <InputLabel>To</InputLabel>
                <Select
                    id='toAccountId'
                    name='toAccountId'
                    label='To'
                    value={formik.values.toAccountId}
                    onChange={formik.handleChange}
                >
                    {
                        accounts.map(account =>
                            <MenuItem value={account.id} key={account.id}>{account.name}</MenuItem>
                        )
                    }
                </Select>
                <FormHelperText>{formik.touched.toAccountId && formik.errors.toAccountId}</FormHelperText>
            </FormControl>
            <FormControl
                fullWidth
                variant='outlined'
                className={classes.formField}
                error={formik.touched.fromAccountId && Boolean(formik.errors.fromAccountId)}
            >
                <InputLabel>From</InputLabel>
                <Select
                    id='fromAccountId'
                    name='fromAccountId'
                    label='From'
                    value={formik.values.fromAccountId}
                    onChange={formik.handleChange}
                >
                    {
                        accounts.map(account =>
                            <MenuItem value={account.id} key={account.id}>{account.name}</MenuItem>
                        )
                    }
                </Select>
                <FormHelperText>{formik.touched.fromAccountId && formik.errors.fromAccountId}</FormHelperText>
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
            {
                mode === 'edit' ? <Button
                    fullWidth
                    variant='contained'
                    color='secondary'
                    startIcon={<DeleteIcon/>}
                    size='large'
                    onClick={onDeleteTransfer}
                >
                    Delete
                </Button> : <></>
            }
        </>
    );
};

export default TransferForm;