import React from 'react';
import {authenticationService} from '../api/authentication.service';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {Button, Container} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.onLogout = this.onLogout.bind(this);
    }

    async onLogout() {
        this.setState({showLoadingModal: true});

        authenticationService.logout();

        this.setState({showLoadingModal: false});

        this.props.history.push('/');
    }

    render() {
        return (
            <React.Fragment>
                <AppBar position='sticky'>
                    <Toolbar>
                        <Typography variant='h6' className='appBarTitle'>Settings</Typography>
                    </Toolbar>
                </AppBar>
                <Container maxWidth='sm' style={{paddingTop: '16px'}}>
                    <Button
                        variant='contained'
                        color='secondary'
                        startIcon={<ExitToAppIcon/>}
                        size='large'
                        style={{width: '100%'}}
                        onClick={this.onLogout}
                    >
                        Logout
                    </Button>
                </Container>
            </React.Fragment>
        );
    }
}

export default Settings;
