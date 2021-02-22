import React, {useContext, useEffect} from "react";
import {Button, Container, IconButton, makeStyles} from "@material-ui/core";
import {useFormik} from "formik";
import {accountService} from "../../api/account.service";
import * as yup from "yup";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";
import LoadingModalContext from "../../context/LoadingModalContext";
import MessageModalContext from "../../context/MessageModalContext";
import {useDispatch, useSelector} from "react-redux";

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

const EditAccount = (props) => {
    const accountId = parseInt(props.match.params.id);
    const accounts = useSelector(state => state.accounts);

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
                const account = await accountService.editAccountById(accountId, accountName);
                dispatch({type: 'editAccount', payload: account});
                toggleLoadingModalOpen();
                props.history.push('/accounts');
            } catch (e) {
                if (e.response && e.response.status === 401) {
                    props.history.push('/')
                }

                toggleLoadingModalOpen();
                showMessageModal('Error', 'An error occurred while processing your request, please try again.');
            }
        },
    });

    useEffect(() => {
        (async function loadInitialData() {
            const account = accounts.find(a => a.id === parseInt(accountId));
            await formik.setFieldValue('accountName', account.name);
        })();
        // eslint-disable-next-line
    }, []);

    const onDeleteAccount = async () => {
        try {
            toggleLoadingModalOpen();
            await accountService.deleteAccountById(accountId);
            dispatch({type: 'deleteAccount', payload: accountId});
            toggleLoadingModalOpen();
            props.history.push('/accounts');
        } catch (e) {
            if (e.response && e.response.status === 401) {
                props.history.push('/')
            }

            toggleLoadingModalOpen();
            showMessageModal('Error', 'An error occurred while processing your request, please try again.');
        }
    };

    return (
        <>
            <AppBar position='sticky'>
                <Toolbar>
                    <Typography variant='h6' className={classes.appBarTitle}>Edit Account</Typography>
                    <IconButton color='inherit' onClick={formik.handleSubmit}>
                        <SaveIcon/>
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
                    <Button
                        fullWidth
                        variant='contained'
                        color='secondary'
                        startIcon={<DeleteIcon/>}
                        size='large'
                        onClick={onDeleteAccount}
                    >
                        Delete
                    </Button>
                </form>
            </Container>
        </>
    );
};

export default EditAccount;
