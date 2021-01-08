import React from 'react';

import AccountForm from "./AccountForm";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";

function EditAccount(props) {
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">Edit Account</Typography>
                </Toolbar>
            </AppBar>
            <AccountForm
                editMode={true}
                accountId={props.match.params.id}
                history={props.history}
            />
        </div>
    );
}

export default EditAccount;
