import React from 'react';
import {useFormik} from 'formik';
import * as yup from 'yup';
import TextField from '@material-ui/core/TextField';
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {Container, IconButton, makeStyles} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import AppBar from "@material-ui/core/AppBar";
import LoadingModalV2 from "../LoadingModalV2";
import {authenticationService} from "../../api/authentication.service";
import MessageModal from "../MessageModal";

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
        width: '100%',
        marginBottom: theme.spacing(3)
    },
    container: {
        paddingTop: theme.spacing(3)
    },
    appBarTitle: {
        flexGrow: 1
    }
}));

const NewUser = (props) => {
    const [loadingModalOpen, setLoadingModalOpen] = React.useState(false);
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
        onSubmit: async (values) => {
            const {userName, password} = values;

            try {
                setLoadingModalOpen(true);
                await authenticationService.newUser(userName, password);
                setLoadingModalOpen(false);
                props.history.push('/accounts');
            } catch (e) {
                setLoadingModalOpen(false);

                setMessageModalTitle('Error');
                setMessageModalMessage('An error occurred while processing your request, please try again.');

                if (e.response && e.response.status === 409) {
                    setMessageModalTitle('User already exists');
                    setMessageModalMessage(`A user with the name "${userName}" already exists, please choose a different user name.`);
                }

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
            <LoadingModalV2 open={loadingModalOpen}/>
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
