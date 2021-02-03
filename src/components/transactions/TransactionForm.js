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
import CategoryTypes from "../categories/CategoryTypes";
import {DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import React, {useEffect} from "react";
import MessageModal from "../MessageModal";
import LoadingModal from "../LoadingModal";
import {categoryService} from "../../api/category.service";
import {accountService} from "../../api/account.service";
import {transactionService} from "../../api/transaction.service";
import moment from "moment";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles(theme => ({
    formField: {
        marginBottom: theme.spacing(3)
    }
}));

const TransactionForm = (props) => {
    const {formik, history, mode, transactionId} = props;

    const [accounts, setAccounts] = React.useState([]);
    const [categories, setCategories] = React.useState([]);
    const [loadingModalOpen, setLoadingModalOpen] = React.useState(true);
    const [messageModalOpen, setMessageModalOpen] = React.useState(false);
    const [messageModalTitle, setMessageModalTitle] = React.useState('');
    const [messageModalMessage, setMessageModalMessage] = React.useState('');

    const classes = useStyles();

    const updateCategories = async (categoryType) => {
        try {
            await formik.setFieldValue('categoryType', categoryType, true);

            if (categoryType !== '') {
                setLoadingModalOpen(true);

                const categories = await categoryService.getAllCategoriesByType(categoryType.toLowerCase());

                if (categories.data && categories.data.length) {
                    setCategories(categories.data);
                }

                setLoadingModalOpen(false);
            } else {
                await formik.setFieldValue('categoryId', '', true);
            }
        } catch (e) {
            if (e.response && e.response.status === 401) {
                history.push('/');
            }

            setLoadingModalOpen(false);

            setMessageModalTitle('Error');
            setMessageModalMessage('An error occurred while processing your request, please try again.');
            setMessageModalOpen(true);
        }
    };

    const onDeleteTransaction = async () => {
        try {
            setLoadingModalOpen(true);
            await transactionService.deleteTransactionById(transactionId);
            setLoadingModalOpen(false);
            history.push(`/transactions/account/${formik.values.accountId}`);
        } catch (e) {
            if (e.response && e.response.status === 401) {
                history.push('/');
            }

            setLoadingModalOpen(false);

            setMessageModalTitle('Error');
            setMessageModalMessage('An error occurred while processing your request, please try again.');
            setMessageModalOpen(true);
        }
    };

    useEffect(() => {
        (async function loadInitialData() {
            try {
                const accounts = await accountService.getAllAccounts();
                setAccounts(accounts.data);

                if (mode === 'edit') {
                    const transaction = await transactionService.getTransactionById(transactionId);
                    const categories = await categoryService.getAllCategoriesByType(transaction.data.category_type.toLowerCase());

                    if (categories.data && categories.data.length) {
                        setCategories(categories.data);
                    }

                    await formik.setFieldValue('value', transaction.data.value);
                    await formik.setFieldValue('description', transaction.data.description);
                    await formik.setFieldValue('accountId', transaction.data.account_id);
                    await formik.setFieldValue('categoryType', transaction.data.category_type);
                    await formik.setFieldValue('categoryId', transaction.data.category_id);
                    await formik.setFieldValue('date', moment(transaction.data.date));
                }

                setLoadingModalOpen(false);
            } catch (e) {
                if (e.response && e.response.status === 401) {
                    history.push('/')
                }

                setLoadingModalOpen(false);

                setMessageModalTitle('Error');
                setMessageModalMessage('An error occurred while processing your request, please try again.');
                setMessageModalOpen(true);
            }
        })()
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <MessageModal
                open={messageModalOpen}
                title={messageModalTitle}
                message={messageModalMessage}
                handleClose={() => setMessageModalOpen(false)}
            />
            <LoadingModal open={loadingModalOpen}/>
            <TextField
                id='value'
                name='value'
                fullWidth
                type='number'
                label='Value'
                variant='outlined'
                autoComplete='off'
                className={classes.formField}
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
            {
                mode === 'edit' ? <Button
                    fullWidth
                    variant='contained'
                    color='secondary'
                    startIcon={<DeleteIcon/>}
                    size='large'
                    onClick={onDeleteTransaction}
                >
                    Delete
                </Button> : <></>
            }
        </>
    );
};

export default TransactionForm;