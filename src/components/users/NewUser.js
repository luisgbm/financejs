import React from 'react';
import {authenticationService} from '../../api/authentication.service';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {Container, IconButton} from '@material-ui/core';
import LoadingModal from "../LoadingModal";
import UserForm from "./UserForm";
import SaveIcon from "@material-ui/icons/Save";

class NewUser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: '',
            password: '',
            showLoadingModal: false
        };

        this.onChange = this.onChange.bind(this);
        this.onNewUser = this.onNewUser.bind(this);
    }

    onChange(fieldName, fieldValue) {
        this.setState({[fieldName]: fieldValue});
    }

    async onNewUser() {
        this.setState({showLoadingModal: true});

        await authenticationService.newUser(this.state.userName, this.state.password);

        this.setState({showLoadingModal: false});

        this.props.history.push('/accounts');
    }

    render() {
        return (
            <React.Fragment>
                <LoadingModal
                    show={this.state.showLoadingModal}
                />
                <AppBar position='sticky'>
                    <Toolbar>
                        <Typography variant='h6' className='appBarTitle'>New User</Typography>
                        <IconButton color='inherit' onClick={this.onNewUser}>
                            <SaveIcon/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Container maxWidth='sm' style={{paddingTop: '16px'}}>
                    <UserForm
                        userName={this.state.userName}
                        password={this.state.password}
                        onChange={this.onChange}
                        error={false}
                    />
                </Container>
            </React.Fragment>
        );
    }
}

export default NewUser;
