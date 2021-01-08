import React from 'react';
import {FormControl, InputLabel, makeStyles, MenuItem, Select, TextField} from "@material-ui/core";
import CategoryTypes from "./CategoryTypes";

const useStyles = makeStyles(() => ({
    formControl: {
        width: '100%'
    }
}));

function CategoryFormV2(props) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <TextField
                label='Category Name'
                variant='outlined'
                style={{width: '100%'}}
                value={props.categoryName}
                onChange={event => props.onChange('categoryName', event.target.value)}
            />
            <FormControl variant='outlined' className={classes.formControl}>
                <InputLabel>Type</InputLabel>
                <Select
                    value={props.categoryType}
                    onChange={event => props.onChange('categoryType', event.target.value)}
                    label='Type'
                    style={{marginTop: '16px'}}
                >
                    <MenuItem value={CategoryTypes.EXPENSE}>Expense</MenuItem>
                    <MenuItem value={CategoryTypes.INCOME}>Income</MenuItem>
                </Select>
            </FormControl>
        </React.Fragment>
    );
}

export default CategoryFormV2;