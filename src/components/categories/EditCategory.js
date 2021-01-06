import React from 'react';

import CategoryForm from "./CategoryForm";

function EditCategory(props) {
    return (
        <div>
            <h1>Edit Category</h1>
            <CategoryForm
                editMode={true}
                categoryId={props.match.params.id}
                history={props.history}
            />
        </div>
    );
}

export default EditCategory;
