import React from 'react';
import {authenticationService} from '../api/authentication.service';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {Button, Container, makeStyles} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import LoadingModal from "./LoadingModal";

const useStyles = makeStyles(theme => ({
    appBarTitle: {
        flexGrow: 1
    },
    container: {
        padding: theme.spacing(3)
    }
}));

const Settings = (props) => {
    const [loadingModalOpen, setLoadingModalOpen] = React.useState(false);

    const classes = useStyles();

    const onLogout = () => {
        setLoadingModalOpen(true);
        authenticationService.logout();
        setLoadingModalOpen(false);
        props.history.push('/');
    };

    return (
        <>
            <LoadingModal
                open={loadingModalOpen}
            />
            <AppBar position='sticky'>
                <Toolbar>
                    <Typography variant='h6' className={classes.appBarTitle}>Settings</Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth='sm' className={classes.container}>
                <Button
                    fullWidth
                    variant='contained'
                    color='secondary'
                    startIcon={<ExitToAppIcon/>}
                    size='large'
                    onClick={onLogout}
                >
                    Logout
                </Button>
            </Container>
        </>
    );
};

export default Settings;
