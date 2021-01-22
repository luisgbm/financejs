import React, {useEffect} from 'react';

import CategoryForm from './CategoryForm';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import SaveIcon from '@material-ui/icons/Save';
import {Button, Container, IconButton} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import LoadingModal from "../LoadingModal";
import {categoryService} from "../../api/category.service";

function EditCategory(props) {
    const [categoryId] = React.useState(props.match.params.id);
    const [categoryName, setCategoryName] = React.useState('');
    const [categoryType, setCategoryType] = React.useState('');
    const [showLoadingModal, setShowLoadingModal] = React.useState(false);

    const onEditCategory = async () => {
        try {
            setShowLoadingModal(true);

            await categoryService.editCategoryById(categoryId, categoryName, categoryType);

            setShowLoadingModal(false);

            props.history.push(`/categories/${categoryType.toLowerCase()}`);
        } catch (e) {
            if (e.response.status === 401) {
                this.props.history.push('/');
            }
        }
    };

    const onDeleteCategory = async () => {
        try {
            setShowLoadingModal(true);

            await categoryService.deleteCategoryById(categoryId);

            setShowLoadingModal(false);

            props.history.push(`/categories/${categoryType.toLowerCase()}`);
        } catch (e) {
            if (e.response.status === 401) {
                this.props.history.push('/');
            }
        }
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
            setShowLoadingModal(true);
            const category = await categoryService.getCategoryById(categoryId);
            setCategoryName(category.data.name);
            setCategoryType(category.data.categorytype);
            setShowLoadingModal(false);
        })()
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <React.Fragment>
            <LoadingModal
                show={showLoadingModal}
            />
            <AppBar position='sticky'>
                <Toolbar>
                    <Typography variant='h6' className='appBarTitle'>Edit Category</Typography>
                    <IconButton color='inherit' onClick={onEditCategory}>
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
                    variant='contained'
                    color='secondary'
                    startIcon={<DeleteIcon/>}
                    size='large'
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
