import React, {useContext} from 'react';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import {
    Container,
    FormControl,
    FormHelperText,
    IconButton,
    InputLabel,
    makeStyles,
    MenuItem,
    Select
} from '@material-ui/core';
import {Done} from '@material-ui/icons';
import CategoryTypes from './CategoryTypes';
import {categoryService} from "../../api/category.service";
import MessageModal from "../MessageModal";
import {useFormik} from "formik";
import * as yup from "yup";
import TextField from "@material-ui/core/TextField";
import LoadingModalContext from "../../context/LoadingModalContext";

const validationSchema = yup.object({
    categoryName: yup
        .string('Enter the category name')
        .required('Category name is required'),
    categoryType: yup
        .string('Select the category type')
        .required('Category type is required')
});

const useStyles = makeStyles(theme => ({
    textField: {
        marginBottom: theme.spacing(3)
    },
    container: {
        padding: theme.spacing(3)
    },
    appBarTitle: {
        flexGrow: 1
    }
}));

const NewCategory = (props) => {
    const toggleLoadingModalOpen = useContext(LoadingModalContext);

    const [messageModalOpen, setMessageModalOpen] = React.useState(false);
    const [messageModalTitle, setMessageModalTitle] = React.useState('');
    const [messageModalMessage, setMessageModalMessage] = React.useState('');

    const classes = useStyles();

    const formik = useFormik({
        initialValues: {
            categoryName: '',
            categoryType: props.match.params.type === 'expense' ? CategoryTypes.EXPENSE : CategoryTypes.INCOME
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const {categoryName, categoryType} = values;

            try {
                toggleLoadingModalOpen();
                await categoryService.newCategory(categoryName, categoryType);
                toggleLoadingModalOpen();
                props.history.push(`/categories/${categoryType.toLowerCase()}`);
            } catch (e) {
                if (e.response && e.response.status === 401) {
                    props.history.push('/');
                }

                toggleLoadingModalOpen();

                setMessageModalTitle('Error');
                setMessageModalMessage('An error occurred while processing your request, please try again.');
                setMessageModalOpen(true);
            }
        },
    });

    return (
        <>
            <MessageModal
                open={messageModalOpen}
                title={messageModalTitle}
                message={messageModalMessage}
                handleClose={() => setMessageModalOpen(false)}
            />
            <AppBar position='sticky'>
                <Toolbar>
                    <Typography variant='h6' className={classes.appBarTitle}>New Category</Typography>
                    <IconButton color='inherit' onClick={formik.handleSubmit}>
                        <Done/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container maxWidth='sm' className={classes.container}>
                <TextField
                    fullWidth
                    id='categoryName'
                    name='categoryName'
                    label='Category Name'
                    variant='outlined'
                    autoComplete='off'
                    className={classes.textField}
                    value={formik.values.categoryName}
                    onChange={formik.handleChange}
                    error={formik.touched.categoryName && Boolean(formik.errors.categoryName)}
                    helperText={formik.touched.categoryName && formik.errors.categoryName}
                />
                <FormControl
                    fullWidth
                    variant='outlined'
                    error={formik.touched.categoryType && Boolean(formik.errors.categoryType)}
                >
                    <InputLabel>Category Type</InputLabel>
                    <Select
                        id='categoryType'
                        name='categoryType'
                        label='Category Type'
                        value={formik.values.categoryType}
                        onChange={formik.handleChange}
                    >
                        <MenuItem value={CategoryTypes.EXPENSE}>Expense</MenuItem>
                        <MenuItem value={CategoryTypes.INCOME}>Income</MenuItem>
                    </Select>
                    <FormHelperText>{formik.touched.categoryType && formik.errors.categoryType}</FormHelperText>
                </FormControl>
            </Container>
        </>
    );
};

export default NewCategory;
