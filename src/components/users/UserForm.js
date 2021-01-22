import React from 'react';
import {makeStyles, TextField} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    textField: {
        width: '100%',
        marginBottom: theme.spacing(2)
    },
    formControl: {
        width: '100%'
    }
}));

function UserForm(props) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <TextField
                label='User Name'
                variant='outlined'
                className={classes.textField}
                value={props.userName}
                onChange={event => props.onChange('userName', event.target.value)}
                error={props.error}
            />
            <TextField
                type='password'
                label='Password'
                variant='outlined'
                className={classes.textField}
                value={props.password}
                onChange={event => props.onChange('password', event.target.value)}
                error={props.error}
            />
        </React.Fragment>
    );
}

export default UserForm;