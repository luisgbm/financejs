import React from 'react';

import TransactionForm from "./TransactionForm";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";

function EditTransaction(props) {
    return (
        <React.Fragment>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">Edit Transaction</Typography>
                </Toolbar>
            </AppBar>
            <TransactionForm
                editMode={true}
                transactionId={props.match.params.transactionId}
                history={props.history}
            />
        </React.Fragment>
    );
}

export default EditTransaction;
