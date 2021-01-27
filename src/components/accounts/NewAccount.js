import React from "react";
import MessageModal from "../MessageModal";
import LoadingModalV2 from "../LoadingModalV2";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {Container, IconButton, makeStyles} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import DoneIcon from "@material-ui/icons/Done";
import {useFormik} from "formik";
import * as yup from "yup";
import {accountService} from "../../api/account.service";
import TextField from "@material-ui/core/TextField";

const validationSchema = yup.object({
    accountName: yup
        .string('Enter the account name')
        .required('Account name is required')
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

const NewAccount = (props) => {
    const [loadingModalOpen, setLoadingModalOpen] = React.useState(false);
    const [messageModalOpen, setMessageModalOpen] = React.useState(false);
    const [messageModalTitle, setMessageModalTitle] = React.useState('');
    const [messageModalMessage, setMessageModalMessage] = React.useState('');

    const classes = useStyles();

    const formik = useFormik({
        initialValues: {
            accountName: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const {accountName} = values;

            try {
                setLoadingModalOpen(true);
                await accountService.newAccount(accountName);
                setLoadingModalOpen(false);
                props.history.push('/accounts');
            } catch (e) {
                setLoadingModalOpen(false);

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
            <LoadingModalV2 open={loadingModalOpen}/>
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