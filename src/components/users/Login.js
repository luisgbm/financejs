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
                    >
                        Login
                    </Button>
                </form>
            </Container>
        </>
    );
};

export default Login;