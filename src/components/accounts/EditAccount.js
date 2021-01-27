import React, {useEffect} from "react";
import {Button, Container, IconButton, makeStyles} from "@material-ui/core";
import {useFormik} from "formik";
import {accountService} from "../../api/account.service";
import * as yup from "yup";
import MessageModal from "../MessageModal";
import LoadingModalV2 from "../LoadingModalV2";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";

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

const EditAccount = (props) => {
    const accountId = props.match.params.id;

    const [loadingModalOpen, setLoadingModalOpen] = React.useState(true);
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
                await accountService.editAccountById(accountId, accountName);
                setLoadingModalOpen(false);
                props.history.push('/accounts');
            } catch (e) {
                if (e.response && e.response.status === 401) {
                    props.history.push('/')
                }

                setLoadingModalOpen(false);

                setMessageModalTitle('Error');
                setMessageModalMessage('An error occurred while processing your request, please try again.');
                setMessageModalOpen(true);
            }
        },
    });

    useEffect(() => {
        (async function loadAccountData() {
            try {
                const account = await accountService.getAccountById(accountId);
                formik.values.accountName = account.data.name;
                setLoadingModalOpen(false);
            } catch (e) {
                if (e.response && e.response.status === 401) {
                    props.history.push('/')
                }

                setLoadingModalOpen(false);

                setMessageModalTitle('Error');
                setMessageModalMessage('An error occurred while processing your request, please try again.');
                setMessageModalOpen(true);
            }

        })();
        // eslint-disable-next-line
    }, []);

    const onDeleteAccount = async () => {
        try {
            setLoadingModalOpen(true);
            await accountService.deleteAccountById(accountId);
            setLoadingModalOpen(false);
            props.history.push('/accounts');
        } catch (e) {
            if (e.response && e.response.status === 401) {
                props.history.push('/')
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
