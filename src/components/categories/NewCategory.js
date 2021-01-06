import React from 'react';

import CategoryForm from "./CategoryForm";

function NewCategory(props) {
    return (
        <div>
            <h1>New Category</h1>
            <CategoryForm
                editMode={false}
                history={props.history}
            />
        </div>
    );
}

export default NewCategory;
