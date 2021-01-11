import React from 'react';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import CategoryForm from './CategoryForm';
import {Container, IconButton} from '@material-ui/core';
import {Done} from '@material-ui/icons';
import finance from '../../api/finance';
import CategoryTypes from './CategoryTypes';
import LoadingModal from "../LoadingModal";

function NewCategory(props) {
    const [categoryName, setCategoryName] = React.useState('');
    const [categoryType, setCategoryType] = React.useState(props.match.params.type === 'expense' ? CategoryTypes.EXPENSE : CategoryTypes.INCOME);
    const [showLoadingModal, setShowLoadingModal] = React.useState(false);

    const onChange = (fieldName, fieldValue) => {
        if (fieldName === 'categoryName') {
            setCategoryName(fieldValue);
        } else if (fieldName === 'categoryType') {
            setCategoryType(fieldValue);
        }
    };

    const onNewCategory = async () => {
        setShowLoadingModal(true);

        await finance.post('/categories', {
            name: categoryName,
            categorytype: categoryType
        });

        setShowLoadingModal(false);

        props.history.push(`/categories/${categoryType.toLowerCase()}`);
    };

    return (
        <React.Fragment>
            <LoadingModal
                show={showLoadingModal}
            />
            <AppBar position='static'>
                <Toolbar>
                    <Typography variant='h6' className='appBarTitle'>New Category</Typography>
                    <IconButton color='inherit' onClick={onNewCategory}>
                        <Done/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container maxWidth='sm' style={{paddingTop: '16px'}}>
                <CategoryForm
                    categoryName={categoryName}
                    categoryType={categoryType}
                    onChange={onChange}
                />
            </Container>
        </React.Fragment>
    );
}

export default NewCategory;
