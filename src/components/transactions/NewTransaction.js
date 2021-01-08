import React from 'react';

import TransactionForm from "./TransactionForm";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";

function NewTransaction(props) {
    return (
        <React.Fragment>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">New Transaction</Typography>
                </Toolbar>
            </AppBar>
            <TransactionForm
                editMode={false}
                accountId={props.match.params.accountId}
                history={props.history}
            />
        </React.Fragment>
    );
}

export default NewTransaction;
