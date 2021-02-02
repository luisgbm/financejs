import {FormControl, FormHelperText, InputLabel, makeStyles, MenuItem, Select, TextField} from "@material-ui/core";
import {DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import React from "react";

const useStyles = makeStyles(theme => ({
    formField: {
        marginBottom: theme.spacing(3)
    }
}));

const NewTransferForm = (props) => {
    const {accounts} = props;

    const classes = useStyles();

    const {formik} = props;

    return (
        <>
            <TextField
                id='value'
                name='value'
                fullWidth
                type='number'
                label='Value'
                variant='outlined'
                autoComplete='off'
                className={classes.formField}
                value={formik.values.value}
                onChange={formik.handleChange}
                error={formik.touched.value && Boolean(formik.errors.value)}
                helperText={formik.touched.value && formik.errors.value}
            />
            <FormControl
                fullWidth
                variant='outlined'
                className={classes.formField}
                error={formik.touched.fromAccountId && Boolean(formik.errors.fromAccountId)}
            >
                <InputLabel>From</InputLabel>
                <Select
                    id='fromAccountId'
                    name='fromAccountId'
                    label='From'
                    value={formik.values.fromAccountId}
                    onChange={formik.handleChange}
                >
                    {
                        accounts.map(account =>
                            <MenuItem value={account.id} key={account.id}>{account.name}</MenuItem>
                        )
                    }
                </Select>
                <FormHelperText>{formik.touched.fromAccountId && formik.errors.fromAccountId}</FormHelperText>
            </FormControl>
            <FormControl
                fullWidth
                variant='outlined'
                className={classes.formField}
                error={formik.touched.toAccountId && Boolean(formik.errors.toAccountId)}
            >
                <InputLabel>To</InputLabel>
                <Select
                    id='toAccountId'
                    name='toAccountId'
                    label='To'
                    value={formik.values.toAccountId}
                    onChange={formik.handleChange}
                >
                    {
                        accounts.map(account =>
                            <MenuItem value={account.id} key={account.id}>{account.name}</MenuItem>
                        )
                    }
                </Select>
                <FormHelperText>{formik.touched.toAccountId && formik.errors.toAccountId}</FormHelperText>
            </FormControl>
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <FormControl
                    fullWidth
                    className={classes.formField}
                >
                    <DateTimePicker
                        label='Date/Time'
                        inputVariant='outlined'
                        value={formik.values.categoryId}
                        onChange={formik.handleChange}
                        error={formik.touched.date && Boolean(formik.errors.date)}
                        helperText={formik.touched.date && formik.errors.date}
                        format='DD/MM/yyyy HH:mm'
                    />
                </FormControl>
            </MuiPickersUtilsProvider>
            <TextField
                id='description'
                name='description'
                fullWidth
                label='Description'
                variant='outlined'
                autoComplete='off'
                className={classes.formField}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
            />
        </>
    );
};

export default NewTransferForm;