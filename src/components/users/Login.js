import React from 'react';
import {authenticationService} from '../../api/authentication.service';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {Button, Container} from '@material-ui/core';
import LoadingModal from "../LoadingModal";
import UserForm from "./UserForm";
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import AddCircleIcon from '@material-ui/icons/AddCircle';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: '',
            password: '',
            showLoadingModal: true,
            error: false
        };

        this.onChange = this.onChange.bind(this);
        this.onLogin = this.onLogin.bind(this);
        this.onNewUser = this.onNewUser.bind(this);
    }

    async componentDidMount() {
        if (await authenticationService.isTokenValid()) {
            this.props.history.push('/accounts');
        }

        this.setState({showLoadingModal: false});
    }

    onChange(fieldName, fieldValue) {
        this.setState({[fieldName]: fieldValue});
    }

    onNewUser() {
        this.props.history.push('/users/new');
    }

    async onLogin() {
        try {
            this.setState({showLoadingModal: true});

            await authenticationService.login(this.state.userName, this.state.password);

            this.setState({showLoadingModal: false});

            this.props.history.push('/accounts');
        } catch (e) {
            this.setState({
                userName: '',
                password: '',
                error: true,
                showLoadingModal: false
            });
        }
    }

    render() {
        return (
            <React.Fragment>
                <LoadingModal
                    show={this.state.showLoadingModal}
                />
                <AppBar position='sticky'>
                    <Toolbar>
                        <Typography variant='h6' className='appBarTitle'>Login</Typography>
                    </Toolbar>
                </AppBar>
                <Container maxWidth='sm' style={{paddingTop: '16px'}}>
                    <UserForm
                        userName={this.state.userName}
                        password={this.state.password}
                        onChange={this.onChange}
                        error={this.state.error}
                    />
                    <Button
                        variant='contained'
                        color='primary'
                        startIcon={<VpnKeyIcon/>}
                        size='large'
                        style={{width: '100%'}}
                        onClick={this.onLogin}
                    >
                        Login
                    </Button>
                    <Button
                        variant='contained'
                        color='secondary'
                        startIcon={<AddCircleIcon/>}
                        size='large'
                        style={{marginTop: '16px', width: '100%', backgroundColor: 'green'}}
                        onClick={this.onNewUser}
                    >
                        New User
                    </Button>
                </Container>
            </React.Fragment>
        );
    }
}

export default Login;
