import React from 'react';
import {FormControl, InputLabel, makeStyles, MenuItem, Select, TextField} from '@material-ui/core';
import CategoryTypes from './CategoryTypes';

const useStyles = makeStyles(theme => ({
    textField: {
        width: '100%',
        marginBottom: theme.spacing(2)
    },
    formControl: {
        width: '100%'
    }
}));

function CategoryForm(props) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <TextField
                label='Category Name'
                variant='outlined'
                className={classes.textField}
                value={props.categoryName}
                onChange={event => props.onChange('categoryName', event.target.value)}
            />
            <FormControl variant='outlined' className={classes.formControl}>
                <InputLabel>Type</InputLabel>
                <Select
                    value={props.categoryType}
                    onChange={event => props.onChange('categoryType', event.target.value)}
                    label='Type'
                >
                    <MenuItem value={CategoryTypes.EXPENSE}>Expense</MenuItem>
                    <MenuItem value={CategoryTypes.INCOME}>Income</MenuItem>
                </Select>
            </FormControl>
        </React.Fragment>
    );
}

export default CategoryForm;