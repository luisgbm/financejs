import React from 'react';
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";
import {AppBar, Button, Container, IconButton, TextField, Toolbar, Typography} from "@material-ui/core";
import finance from "../../api/finance";

class EditAccount extends React.Component {
    constructor(props) {
        super(props);

        this.onEditAccount = this.onEditAccount.bind(this);
        this.onDeleteAccount = this.onDeleteAccount.bind(this);

        this.state = {
            accountId: props.match.params.id,
            accountName: ''
        };
    }

    async componentDidMount() {
        const account = await finance.get(`/accounts/${this.state.accountId}`);
        this.setState({accountName: account.data.name});
    }

    async onEditAccount() {
        await finance.patch(`/accounts/${this.state.accountId}`, {
            name: this.state.accountName
        });

        this.props.history.push('/');
    }

    async onDeleteAccount() {
        await finance.delete(`/accounts/${this.state.accountId}`);

        this.props.history.push('/');
    }

    render() {
        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" className="appBarTitle">Edit Account</Typography>
                        <IconButton color="inherit" onClick={this.onEditAccount}>
                            <SaveIcon/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="sm" style={{paddingTop: '16px'}}>
                    <TextField
                        label="Account Name"
                        variant="outlined"
                        style={{width: '100%'}}
                        value={this.state.accountName}
                        onChange={event => this.setState({accountName: event.target.value})}
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<DeleteIcon/>}
                        size="large"
                        style={{width: '100%', marginTop: '16px'}}
                        onClick={this.onDeleteAccount}
                    >
                        Delete
                    </Button>
                </Container>
            </div>
        );
    }
}

export default EditAccount;
