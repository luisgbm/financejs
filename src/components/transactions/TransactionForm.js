import React from 'react';
import {FormControl, InputLabel, makeStyles, MenuItem, Select, TextField} from '@material-ui/core';
import CategoryTypes from '../categories/CategoryTypes';
import {DateTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

const useStyles = makeStyles(theme => ({
    textField: {
        width: '100%',
        marginBottom: theme.spacing(2)
    },
    formControl: {
        width: '100%',
        marginBottom: theme.spacing(2)
    }
}));

function TransactionForm(props) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <TextField
                type='number'
                label='Value'
                variant='outlined'
                className={classes.textField}
                value={props.value}
                onChange={event => props.onChange('value', event.target.value)}
            />
            <TextField
                label='Description'
                variant='outlined'
                className={classes.textField}
                value={props.description}
                onChange={event => props.onChange('description', event.target.value)}
            />
            <FormControl variant='outlined' className={classes.formControl}>
                <InputLabel>Account</InputLabel>
                <Select
                    value={props.accountId}
                    onChange={event => props.onChange('accountId', event.target.value)}
                    label='Account'
                    className={classes.select}
                >
                    {
                        props.accounts.map(account =>
                            <MenuItem value={account.id} key={account.id}>{account.name}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>
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
            <FormControl variant='outlined' className={classes.formControl}>
                <InputLabel>Category</InputLabel>
                <Select
                    value={props.categoryId}
                    onChange={event => props.onChange('categoryId', event.target.value)}
                    label='Category'
                >
                    {
                        props.categories.map(category =>
                            <MenuItem value={category.id} key={category.id}>{category.name}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <FormControl className={classes.formControl}>
                    <DateTimePicker
                        label='Date/Time'
                        inputVariant='outlined'
                        value={props.date}
                        format='DD/MM/yyyy HH:mm:ss'
                        onChange={date => props.onChange('date', date)}
                    />
                </FormControl>
            </MuiPickersUtilsProvider>
        </React.Fragment>
    );
}

export default TransactionForm;