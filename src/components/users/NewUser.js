import React, {useContext} from 'react';
import {useFormik} from 'formik';
import * as yup from 'yup';
import TextField from '@material-ui/core/TextField';
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {Container, IconButton, makeStyles} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import AppBar from "@material-ui/core/AppBar";
import {authenticationService} from "../../api/authentication.service";
import LoadingModalContext from "../../context/LoadingModalContext";
import MessageModalContext from "../../context/MessageModalContext";
import {useDispatch} from "react-redux";

const validationSchema = yup.object({
    userName: yup
        .string('Enter your user name')
        .required('User name is required'),
    password: yup
        .string('Enter your password')
        .min(6, 'Password should have at least 6 characters')
        .required('Password is required'),
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

const NewUser = (props) => {
    const toggleLoadingModalOpen = useContext(LoadingModalContext);
    const {showMessageModal} = useContext(MessageModalContext);

    const classes = useStyles();
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            userName: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const {userName, password} = values;

            try {
                toggleLoadingModalOpen();
                const initialData = await authenticationService.newUser(userName, password);
                dispatch({type: 'setAccounts', payload: initialData.accounts});
                dispatch({type: 'setCategories', payload: initialData.categories});
                toggleLoadingModalOpen();
                props.history.push('/accounts');
            } catch (e) {
                toggleLoadingModalOpen();


                if (e.response && e.response.status === 409) {
                    showMessageModal('User already exists',
                        `A user with the name "${userName}" already exists, please choose a different user name.`);
                } else {
                    showMessageModal('Error', 'An error occurred while processing your request, please try again.');
                }

                toggleLoadingModalOpen();
            }
        },
    });

    return (
        <>
            <AppBar position='sticky'>
                <Toolbar>
                    <Typography variant='h6' className={classes.appBarTitle}>New User</Typography>
                    <IconButton color='inherit' onClick={formik.handleSubmit}>
                        <SaveIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container maxWidth='sm' className={classes.container}>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        autoCapitalize='none'
                        fullWidth
                        id='userName'
                        name='userName'
                        label='User Name'
                        variant='outlined'
                        autoComplete='off'
                        className={classes.textField}
                        value={formik.values.userName}
                        onChange={formik.handleChange}
                        error={formik.touched.userName && Boolean(formik.errors.userName)}
                        helperText={formik.touched.userName && formik.errors.userName}
                    />
                    <TextField
                        fullWidth
                        id='password'
                        name='password'
                        label='Password'
                        variant='outlined'
                        type='password'
                        className={classes.textField}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                </form>
            </Container>
        </>
    );
};

export default NewUser;
