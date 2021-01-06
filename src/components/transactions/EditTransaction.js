import React from 'react';

import TransactionForm from "./TransactionForm";

function EditTransaction(props) {
    return (
        <div>
            <h1>Edit Transaction</h1>
            <TransactionForm
                editMode={true}
                transactionId={props.match.params.transactionId}
                history={props.history}
            />
        </div>
    );
}

export default EditTransaction;
