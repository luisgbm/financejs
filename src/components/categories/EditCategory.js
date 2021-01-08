import React from 'react';

import CategoryForm from "./CategoryForm";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";

function EditCategory(props) {
    return (
        <React.Fragment>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">Edit Category</Typography>
                </Toolbar>
            </AppBar>
            <CategoryForm
                editMode={true}
                categoryId={props.match.params.id}
                history={props.history}
            />
        </React.Fragment>
    );
}

export default EditCategory;
