import React from 'react';

import AccountForm from "./AccountForm";

function EditAccount(props) {
    return (
        <div>
            <h1>Edit Account</h1>
            <AccountForm
                editMode={true}
                accountId={props.match.params.id}
                history={props.history}
            />
        </div>
    );
}

export default EditAccount;
