import React, {useContext, useEffect} from 'react';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import SaveIcon from '@material-ui/icons/Save';
import {
    Button,
    Container,
    FormControl,
    FormHelperText,
    IconButton,
    InputLabel,
    makeStyles,
    MenuItem,
    Select
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import {categoryService} from "../../api/category.service";
import * as yup from "yup";
import {useFormik} from "formik";
import CategoryTypes from "./CategoryTypes";
import TextField from "@material-ui/core/TextField";
import LoadingModalContext from "../../context/LoadingModalContext";
import MessageModalContext from "../../context/MessageModalContext";

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
    },
    button: {
        marginTop: theme.spacing(3)
    }
}));

const EditCategory = (props) => {
    const categoryId = props.match.params.id;

    const toggleLoadingModalOpen = useContext(LoadingModalContext);
    const {showMessageModal} = useContext(MessageModalContext);

    const classes = useStyles();

    const formik = useFormik({
        initialValues: {
            categoryName: '',
            categoryType: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const {categoryName, categoryType} = values;

            try {
                toggleLoadingModalOpen();
                await categoryService.editCategoryById(categoryId, categoryName, categoryType);
                toggleLoadingModalOpen();
                props.history.push(`/categories/${categoryType.toLowerCase()}`);
            } catch (e) {
                if (e.response && e.response.status === 401) {
                    props.history.push('/');
                }

                toggleLoadingModalOpen();
                showMessageModal('Error', 'An error occurred while processing your request, please try again.');
            }
        },
    });

    const onDeleteCategory = async () => {
        try {
            toggleLoadingModalOpen();
            await categoryService.deleteCategoryById(categoryId);
            toggleLoadingModalOpen();
            props.history.push('/categories');
        } catch (e) {
            if (e.response && e.response.status === 401) {
                props.history.push('/')
            }

            toggleLoadingModalOpen();
            showMessageModal('Error', 'An error occurred while processing your request, please try again.');
        }
    }

    useEffect(() => {
        (async function loadCategoryData() {
            try {
                toggleLoadingModalOpen();
                const category = await categoryService.getCategoryById(categoryId);
                formik.values.categoryName = category.data.name;
                formik.values.categoryType = category.data.categorytype;
                toggleLoadingModalOpen();
            } catch (e) {
                if (e.response && e.response.status === 401) {
                    props.history.push('/')
                }

                toggleLoadingModalOpen();
                showMessageModal('Error', 'An error occurred while processing your request, please try again.');
            }
        })()
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <AppBar position='sticky'>
                <Toolbar>
                    <Typography variant='h6' className={classes.appBarTitle}>Edit Category</Typography>
                    <IconButton color='inherit' onClick={formik.handleSubmit}>
                        <SaveIcon/>
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
                    helperText={formik.touched.categoryType && formik.errors.categoryType}
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
                <Button
                    fullWidth
                    variant='contained'
                    color='secondary'
                    startIcon={<DeleteIcon/>}
                    size='large'
                    onClick={onDeleteCategory}
                    className={classes.button}
                >
                    Delete
                </Button>
            </Container>
        </>
    );
}

export default EditCategory;
