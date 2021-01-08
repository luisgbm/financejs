import React from 'react';

import CategoryForm from "./CategoryForm";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";

function NewCategory(props) {
    return (
        <React.Fragment>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">New Category</Typography>
                </Toolbar>
            </AppBar>
            <CategoryForm
                editMode={false}
                history={props.history}
            />
        </React.Fragment>
    );
}

export default NewCategory;
