import React from 'react';
import {FormControl, InputLabel, makeStyles, MenuItem, Select, TextField} from '@material-ui/core';
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

function TransferForm(props) {
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
                <InputLabel>From</InputLabel>
                <Select
                    value={props.from}
                    onChange={event => props.onChange('from', event.target.value)}
                    label='From'
                    className={classes.select}
                >
                    {
                        props.fromAccounts.map(account =>
                            <MenuItem value={account.id} key={account.id}>{account.name}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>
            <FormControl variant='outlined' className={classes.formControl}>
                <InputLabel>To</InputLabel>
                <Select
                    value={props.to}
                    onChange={event => props.onChange('to', event.target.value)}
                    label='To'
                    className={classes.select}
                >
                    {
                        props.toAccounts.map(account =>
                            <MenuItem value={account.id} key={account.id}>{account.name}</MenuItem>
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
                        format='DD/MM/yyyy HH:mm'
                        onChange={date => props.onChange('date', date)}
                    />
                </FormControl>
            </MuiPickersUtilsProvider>
        </React.Fragment>
    );
}

export default TransferForm;