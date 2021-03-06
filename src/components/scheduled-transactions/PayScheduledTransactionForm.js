import {FormControl, FormHelperText, InputLabel, makeStyles, MenuItem, Select, TextField} from "@material-ui/core";
import CategoryTypes from "../categories/CategoryTypes";
import {DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import React, {useContext, useEffect} from "react";
import moment from "moment";
import LoadingModalContext from "../../context/LoadingModalContext";
import MessageModalContext from "../../context/MessageModalContext";
import {useSelector} from "react-redux";
import currency from "currency.js";

const useStyles = makeStyles(theme => ({
    formField: {
        marginBottom: theme.spacing(3)
    }
}));

const PayScheduledTransactionForm = (props) => {
    const {formik, history} = props;
    const scheduledTransactionId = parseInt(props.scheduledTransactionId);
    const allscheduledTransactions = useSelector(state => state.scheduledTransactions);

    const toggleLoadingModalOpen = useContext(LoadingModalContext);
    const {showMessageModal} = useContext(MessageModalContext);

    const accounts = useSelector(state => state.accounts);
    const allCategories = useSelector(state => state.categories);

    const [categories, setCategories] = React.useState([]);

    const classes = useStyles();

    const updateCategories = async (categoryType) => {
        await formik.setFieldValue('categoryType', categoryType, true);

        if (categoryType !== '') {
            setCategories(allCategories.filter(category => category.categorytype === categoryType));
        }

        await formik.setFieldValue('categoryId', '', true);
    };

    useEffect(() => {
        (async function loadInitialData() {
            try {
                toggleLoadingModalOpen();

                const scheduledTransaction = allscheduledTransactions.find(scheduledTransaction => scheduledTransaction.id === scheduledTransactionId);

                setCategories(allCategories.filter(category => category.categorytype === scheduledTransaction.category_type));

                await formik.setFieldValue('value', currency(scheduledTransaction.value, {fromCents: true}));
                await formik.setFieldValue('description', scheduledTransaction.description);
                await formik.setFieldValue('accountId', scheduledTransaction.account_id);
                await formik.setFieldValue('categoryType', scheduledTransaction.category_type);
                await formik.setFieldValue('categoryId', scheduledTransaction.category_id);
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

export default PayScheduledTransactionForm;