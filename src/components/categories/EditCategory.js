import React, {useEffect} from 'react';

import CategoryForm from "./CategoryForm";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import SaveIcon from "@material-ui/icons/Save";
import {Button, Container, IconButton} from "@material-ui/core";
import finance from "../../api/finance";
import DeleteIcon from "@material-ui/icons/Delete";

function EditCategory(props) {
    const [categoryId] = React.useState(props.match.params.id);
    const [categoryName, setCategoryName] = React.useState('');
    const [categoryType, setCategoryType] = React.useState('');

    const onEditCategory = async () => {
        await finance.patch(`/categories/${categoryId}`, {
            name: categoryName,
            categorytype: categoryType
        });

        props.history.push('/categories');
    };

    const onDeleteCategory = async () => {
        await finance.delete(`/categories/${categoryId}`);

        props.history.push('/categories');
    }

    const onChange = (fieldName, fieldValue) => {
        if (fieldName === 'categoryName') {
            setCategoryName(fieldValue);
        } else if (fieldName === 'categoryType') {
            setCategoryType(fieldValue);
        }
    };

    useEffect(() => {
        (async function getCategoryData() {
            const category = await finance.get(`/categories/${categoryId}`);
            setCategoryName(category.data.name);
            setCategoryType(category.data.categorytype);
        })()
    }, [categoryId]);

    return (
        <React.Fragment>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className="appBarTitle">Edit Category</Typography>
                    <IconButton color="inherit" onClick={onEditCategory}>
                        <SaveIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container maxWidth='sm' style={{paddingTop: '16px'}}>
                <CategoryForm
                    categoryName={categoryName}
                    categoryType={categoryType}
                    onChange={onChange}
                />
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<DeleteIcon/>}
                    size="large"
                    style={{width: '100%', marginTop: '16px'}}
                    onClick={onDeleteCategory}
                >
                    Delete
                </Button>
            </Container>
        </React.Fragment>
    );
}

export default EditCategory;
