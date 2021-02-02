import {FormControl, FormHelperText, InputLabel, makeStyles, MenuItem, Select, TextField} from "@material-ui/core";
import CategoryTypes from "../categories/CategoryTypes";
import {DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import React from "react";
import MessageModal from "../MessageModal";
import LoadingModalV2 from "../LoadingModalV2";
import {categoryService} from "../../api/category.service";

const useStyles = makeStyles(theme => ({
    formField: {
        marginBottom: theme.spacing(3)
    }
}));

const NewTransactionForm = (props) => {
    const {accounts} = props;

    const [categories, setCategories] = React.useState([]);
    const [loadingModalOpen, setLoadingModalOpen] = React.useState(false);
    const [messageModalOpen, setMessageModalOpen] = React.useState(false);
    const [messageModalTitle, setMessageModalTitle] = React.useState('');
    const [messageModalMessage, setMessageModalMessage] = React.useState('');

    const classes = useStyles();

    const {formik} = props;

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
                props.history.push('/');
            }

            setLoadingModalOpen(false);

            setMessageModalTitle('Error');
            setMessageModalMessage('An error occurred while processing your request, please try again.');
            setMessageModalOpen(true);
        }
    };

    return (
        <>
            <MessageModal
                open={messageModalOpen}
                title={messageModalTitle}
                message={messageModalMessage}
                handleClose={() => setMessageModalOpen(false)}
            />
            <LoadingModalV2 open={loadingModalOpen}/>
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
                        value={formik.values.categoryId}
                        onChange={formik.handleChange}
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

export default NewTransactionForm;