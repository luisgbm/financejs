import React, {useContext} from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {Container, IconButton, makeStyles} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import DoneIcon from "@material-ui/icons/Done";
import {useFormik} from "formik";
import * as yup from "yup";
import {accountService} from "../../api/account.service";
import TextField from "@material-ui/core/TextField";
import LoadingModalContext from "../../context/LoadingModalContext";
import MessageModalContext from "../../context/MessageModalContext";
import {useDispatch} from "react-redux";

const validationSchema = yup.object({
    accountName: yup
        .string('Enter the account name')
        .required('Account name is required')
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

const NewAccount = (props) => {
    const toggleLoadingModalOpen = useContext(LoadingModalContext);
    const {showMessageModal} = useContext(MessageModalContext);

    const classes = useStyles();
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            accountName: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const {accountName} = values;

            try {
                toggleLoadingModalOpen();
                const newAccount = await accountService.newAccount(accountName);
                dispatch({type: 'addAccount', payload: newAccount});
                toggleLoadingModalOpen();
                props.history.push('/accounts');
            } catch (e) {
                if (e.response && e.response.status === 401) {
                    props.history.push('/');
                }

                toggleLoadingModalOpen();
                showMessageModal('Error', 'An error occurred while processing your request, please try again.');
            }
        },
    });

    return (
        <>
            <AppBar position='sticky'>
                <Toolbar>
                    <Typography variant='h6' className={classes.appBarTitle}>New Account</Typography>
                    <IconButton color='inherit' onClick={formik.handleSubmit}>
                        <DoneIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container maxWidth='sm' className={classes.container}>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        id='accountName'
                        name='accountName'
                        label='Account Name'
                        variant='outlined'
                        autoComplete='off'
                        className={classes.textField}
                        value={formik.values.accountName}
                        onChange={formik.handleChange}
                        error={formik.touched.accountName && Boolean(formik.errors.accountName)}
                        helperText={formik.touched.accountName && formik.errors.accountName}
                    />
                </form>
            </Container>
        </>
    );
};

export default NewAccount;