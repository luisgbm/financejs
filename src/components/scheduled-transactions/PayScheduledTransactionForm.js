import {FormControl, FormHelperText, InputLabel, makeStyles, MenuItem, Select, TextField} from "@material-ui/core";
import CategoryTypes from "../categories/CategoryTypes";
import {DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import React, {useContext, useEffect} from "react";
import {categoryService} from "../../api/category.service";
import {accountService} from "../../api/account.service";
import moment from "moment";
import CurrencyTextField from "../CurrencyTextField";
import {moneyFormat} from "../../utils/utils";
import LoadingModalContext from "../../context/LoadingModalContext";
import MessageModalContext from "../../context/MessageModalContext";
import {scheduledTransactionService} from "../../api/scheduled.transactions.service";

const useStyles = makeStyles(theme => ({
    formField: {
        marginBottom: theme.spacing(3)
    }
}));

const PayScheduledTransactionForm = (props) => {
    const {formik, history, scheduledTransactionId} = props;

    const toggleLoadingModalOpen = useContext(LoadingModalContext);
    const {showMessageModal} = useContext(MessageModalContext);

    const [accounts, setAccounts] = React.useState([]);
    const [categories, setCategories] = React.useState([]);

    const classes = useStyles();

    const updateCategories = async (categoryType) => {
        try {
            await formik.setFieldValue('categoryType', categoryType, true);

            if (categoryType !== '') {
                toggleLoadingModalOpen();

                const categories = await categoryService.getAllCategoriesByType(categoryType.toLowerCase());

                if (categories.data && categories.data.length) {
                    setCategories(categories.data);
                }

                toggleLoadingModalOpen();
            } else {
                await formik.setFieldValue('categoryId', '', true);
            }
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

                const scheduledTransaction = await scheduledTransactionService.getScheduledTransactionById(scheduledTransactionId);

                const categories = await categoryService.getAllCategoriesByType(scheduledTransaction.data.category_type.toLowerCase());
                setCategories(categories.data);

                await formik.setFieldValue('value', moneyFormat(scheduledTransaction.data.value, true));
                await formik.setFieldValue('description', scheduledTransaction.data.description);
                await formik.setFieldValue('accountId', scheduledTransaction.data.account_id);
                await formik.setFieldValue('categoryType', scheduledTransaction.data.category_type);
                await formik.setFieldValue('categoryId', scheduledTransaction.data.category_id);
                await formik.setFieldValue('date', moment(scheduledTransaction.data.next_date));

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