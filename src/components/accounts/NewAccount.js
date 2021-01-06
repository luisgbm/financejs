import React from 'react';

import AccountForm from "./AccountForm";

function NewAccount(props) {
    return (
        <div>
            <h1>New Account</h1>
            <AccountForm
                editMode={false}
                history={props.history}
            />
        </div>
    );
}

export default NewAccount;
