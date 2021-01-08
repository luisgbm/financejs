import React from 'react';

import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import CategoryFormV2 from "./CategoryFormV2";
import {Container, IconButton} from "@material-ui/core";
import {Done} from "@material-ui/icons";
import finance from "../../api/finance";
import CategoryTypes from "./CategoryTypes";

function NewCategory(props) {
    const [categoryName, setCategoryName] = React.useState('');
    const [categoryType, setCategoryType] = React.useState(CategoryTypes.EXPENSE);

    const onChange = (fieldName, fieldValue) => {
        if (fieldName === 'categoryName') {
            setCategoryName(fieldValue);
        } else if (fieldName === 'categoryType') {
            setCategoryType(fieldValue);
        }
    };

    const onNewCategory = async () => {
        await finance.post('/categories', {
            name: categoryName,
            categorytype: categoryType
        });

        props.history.push('/categories');
    };

    return (
        <React.Fragment>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className="appBarTitle">New Category</Typography>
                    <IconButton color="inherit" onClick={onNewCategory}>
                        <Done/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container maxWidth='sm' style={{paddingTop: '16px'}}>
                <CategoryFormV2
                    categoryName={categoryName}
                    categoryType={categoryType}
                    onChange={onChange}
                />
            </Container>
        </React.Fragment>
    );
}

export default NewCategory;
