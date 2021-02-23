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
import CategoryTypes from "../categories/CategoryTypes";
import {DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import RepeatFrequencies from "./RepeatFrequencies";
import {scheduledTransactionService} from "../../api/scheduled.transactions.service";
import {moneyFormat} from "../../utils/utils";
import moment from "moment";
import DeleteIcon from "@material-ui/icons/Delete";
import {useDispatch, useSelector} from "react-redux";

const useStyles = makeStyles(theme => ({
    formField: {
        marginBottom: theme.spacing(3)
    }
}));

const ScheduledTransactionForm = (props) => {
    const {formik, history, mode, scheduledTransactionId} = props;

    const toggleLoadingModalOpen = useContext(LoadingModalContext);
    const {showMessageModal} = useContext(MessageModalContext);

    const accounts = useSelector(state => state.accounts);
    const allCategories = useSelector(state => state.categories);

    const [categories, setCategories] = React.useState([]);

    const classes = useStyles();
    const dispatch = useDispatch();

    const updateCategories = async (categoryType) => {
        await formik.setFieldValue('categoryType', categoryType, true);

        if (categoryType !== '') {
            setCategories(allCategories.filter(category => category.categorytype === categoryType));
        } else {
            await formik.setFieldValue('categoryId', '', true);
        }
    };

    const onDeleteScheduledTransaction = async () => {
        try {
            toggleLoadingModalOpen();
            await scheduledTransactionService.deleteScheduledTransactionById(scheduledTransactionId);
            dispatch({type: 'deleteScheduledTransaction', payload: parseInt(scheduledTransactionId)});
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

                if (mode === 'edit') {
                    const scheduledTransaction = await scheduledTransactionService.getScheduledTransactionById(scheduledTransactionId);

                    setCategories(allCategories.filter(category => category.categorytype === scheduledTransaction.category_type));

                    await formik.setFieldValue('value', moneyFormat(scheduledTransaction.value, true));
                    await formik.setFieldValue('description', scheduledTransaction.description);
                    await formik.setFieldValue('accountId', scheduledTransaction.account_id);
                    await formik.setFieldValue('categoryType', scheduledTransaction.category_type);
                    await formik.setFieldValue('categoryId', scheduledTransaction.category_id);
                    await formik.setFieldValue('createdDate', moment(scheduledTransaction.created_date));
                    await formik.setFieldValue('repeat', scheduledTransaction.repeat);

                    if (scheduledTransaction.repeat === true) {
                        await formik.setFieldValue('repeatFreq', scheduledTransaction.repeat_freq);
                        await formik.setFieldValue('repeatInterval', scheduledTransaction.repeat_interval);
                        await formik.setFieldValue('infiniteRepeat', scheduledTransaction.infinite_repeat);

                        if (scheduledTransaction.infinite_repeat === false) {
                            await formik.setFieldValue('endAfterRepeats', scheduledTransaction.end_after_repeats);
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
                error={formik.touched.categoryType && Boolean(formik.errors.categoryType)}
            >
                <InputLabel>Type</InputLabel>
                <Select
                    id='categoryType'
                    name='categoryType'
                    label='Type'
                    value={formik.values.categoryType}
                    onChange={e => updateCategories(e.target.value)}
                >
                    <MenuItem value=''><em>Select...</em></MenuItem>
                    <MenuItem value={CategoryTypes.EXPENSE}>Expense</MenuItem>
                    <MenuItem value={CategoryTypes.INCOME}>Income</MenuItem>
                </Select>
                <FormHelperText>{formik.touched.categoryType && formik.errors.categoryType}</FormHelperText>
            </FormControl>
            <FormControl
                disabled={formik.values.categoryType === ''}
                fullWidth
                variant='outlined'
                className={classes.formField}
                error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
            >
                <InputLabel>Category</InputLabel>
                <Select
                    id='categoryId'
                    name='categoryId'
                    label='Category'
                    className={classes.select}
                    value={formik.values.categoryId}
                    onChange={formik.handleChange}
                >
                    <MenuItem value=''><em>Select...</em></MenuItem>
                    {
                        categories.map(category =>
                            <MenuItem value={category.id} key={category.id}>{category.name}</MenuItem>
                        )
                    }
                </Select>
                <FormHelperText>{formik.touched.categoryId && formik.errors.categoryId}</FormHelperText>
            </FormControl>
            <FormControl
                fullWidth
                variant='outlined'
                className={classes.formField}
                error={formik.touched.accountId && Boolean(formik.errors.accountId)}
            >
                <InputLabel>Account</InputLabel>
                <Select
                    id='accountId'
                    name='accountId'
                    label='Account'
                    value={formik.values.accountId}
                    onChange={formik.handleChange}
                >
                    {
                        accounts.map(account =>
                            <MenuItem value={account.id} key={account.id}>{account.name}</MenuItem>
                        )
                    }
                </Select>
                <FormHelperText>{formik.touched.accountId && formik.errors.accountId}</FormHelperText>
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
                    onClick={onDeleteScheduledTransaction}
                >
                    Delete
                </Button> : <></>
            }
        </>
    );
};

export default ScheduledTransactionForm;