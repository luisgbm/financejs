import React from 'react';
import {Card, CardHeader, IconButton, makeStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import CreateIcon from "@material-ui/icons/Create";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
    card: {
        marginBottom: theme.spacing(3)
    },
    link: {
        textDecoration: 'none'
    },
    green: {
        color: 'green'
    },
    red: {
        color: 'red'
    }
}));

const AccountCard = (props) => {
    const classes = useStyles();

    return (
        <Card key={props.accountId} variant='outlined' className={classes.card}>
            <CardHeader
                action={
                    <IconButton component={Link} to={`/accounts/edit/${props.accountId}`}>
                        <CreateIcon/>
                    </IconButton>
                }
                title={
                    <Link
                        underline='none'
                        to={`/transactions/account/${props.accountId}`}>
                        <Typography variant='h6' className={classes.link}>
                            {props.accountName}
                        </Typography>
                    </Link>
                }
                subheader={
                    <>
                        Balance: <span className={props.accountBalance >= 0 ? classes.green : classes.red}>
                            {props.accountBalance}
                        </span>
                    </>
                }
            />
        </Card>
    );
};

export default AccountCard;