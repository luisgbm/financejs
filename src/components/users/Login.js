import React, {useEffect} from 'react';
import {Button, Container, IconButton, makeStyles} from "@material-ui/core";
import * as yup from "yup";
import {useFormik} from "formik";
import {authenticationService} from "../../api/authentication.service";
import MessageModal from "../MessageModal";
import LoadingModal from "../LoadingModal";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import {Add} from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import VpnKeyIcon from "@material-ui/icons/VpnKey";

const validationSchema = yup.object({
    userName: yup
        .string('Enter your user name')
        .required('User name is required'),
    password: yup
        .string('Enter your password')
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
    },
    marginBottom: {
        marginBottom: theme.spacing(3)
    }
}));

const Login = (props) => {
    const [loadingModalOpen, setLoadingModalOpen] = React.useState(true);
    const [messageModalOpen, setMessageModalOpen] = React.useState(false);
    const [messageModalTitle, setMessageModalTitle] = React.useState('');
    const [messageModalMessage, setMessageModalMessage] = React.useState('');

    const classes = useStyles();

    const formik = useFormik({
        initialValues: {
            userName: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values, {resetForm}) => {
            const {userName, password} = values;

            try {
                setLoadingModalOpen(true);
                await authenticationService.login(userName, password);
                setLoadingModalOpen(false);
                props.history.push('/accounts');
            } catch (e) {
                resetForm();

                setLoadingModalOpen(false);

                setMessageModalTitle('Error');
                setMessageModalMessage('An error occurred while processing your request, please try again.');

                if (e.response && e.response.status === 401) {
                    setMessageModalTitle('Login failed');
                    setMessageModalMessage('Wrong user name or password, please try again.');
                }

                setMessageModalOpen(true);
            }
        },
    });

    const onNewUser = () => {
        props.history.push('/users/new');
    };

    useEffect(() => {
        (async function checkToken() {
            if (await authenticationService.isTokenValid()) {
                props.history.push('/accounts');
            }

            setLoadingModalOpen(false);
        })();
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <MessageModal
                open={messageModalOpen}
                title={messageModalTitle}
                message={messageModalMessage}
                handleClose={() => setMessageModalOpen(false)}
            />
            <LoadingModal open={loadingModalOpen}/>
            <AppBar position='sticky'>
                <Toolbar>
                    <Typography variant='h6' className={classes.appBarTitle}>Login</Typography>
                    <IconButton color='inherit' onClick={onNewUser}>
                        <Add/>
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
                    <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        color='primary'
                        startIcon={<VpnKeyIcon/>}
                        size='large'
                        className={classes.marginBottom}
                    >
                        Login
                    </Button>
                    <br/>
                    <Typography variant='h5' className={classes.marginBottom}>How to use the app</Typography>
                    <Typography className={classes.marginBottom}>Finance lets you keep track of your transactions. But
                        before we get there, we need to setup a few things first.</Typography>
                    <Typography variant='h6' className={classes.marginBottom}>Categories</Typography>
                    <Typography className={classes.marginBottom}>The first thing to do when you log into Finance is to
                        create a few categories.</Typography>
                    <Typography className={classes.marginBottom}>Categories can be of two types: Expenses and Incomes.
                        Expenses are things you spend money on, like Food, or your Car. Incomes are things from which
                        you earn money, like the Salary from your job, or Earnings from the stock market.</Typography>
                    <Typography variant='h6' className={classes.marginBottom}>Accounts</Typography>
                    <Typography className={classes.marginBottom}>Transactions belong into accounts, so the next thing to
                        do is to create a few accounts. These can be your Bank account, your Credit Card, or even your
                        Wallet for cash transactions.</Typography>
                    <Typography variant='h6' className={classes.marginBottom}>Transactions</Typography>
                    <Typography className={classes.marginBottom}>With categories and accounts, you can now create a
                        transaction. A transaction has a value, a category, a date, and optionally a description. If you
                        create an Expense transaction, it will subtract money from your account. If you create an Income
                        transaction, it will add money to your account. The account keeps track of all your transactions
                        and calculates the balance.</Typography>
                    <Typography variant='h6' className={classes.marginBottom}>Transfers</Typography>
                    <Typography className={classes.marginBottom}>Transfers are a special kind of transactions. They
                        don't have a category, but they have an origin account (From) and a destination account (To),
                        and also optionally a description. When you create a transfer, it will subtract money from the
                        origin account, and add money to the destination account.</Typography>
                </form>
            </Container>
        </>
    );
};

export default Login;