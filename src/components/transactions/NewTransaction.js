import React from 'react';

import TransactionForm from "./TransactionForm";

function NewTransaction(props) {
    return (
        <div>
            <h1>New Transaction</h1>
            <TransactionForm
                editMode={false}
                accountId={props.match.params.accountId}
                history={props.history}
            />
        </div>
    );
}

export default NewTransaction;
