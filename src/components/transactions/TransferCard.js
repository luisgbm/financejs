import {Card, CardHeader, IconButton, makeStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import CreateIcon from "@material-ui/icons/Create";
import Typography from "@material-ui/core/Typography";
import React from "react";
import moment from "moment";

const useStyles = makeStyles(theme => ({
    card: {
        marginBottom: theme.spacing(3)
    },
    red: {
        color: 'red'
    },
    green: {
        color: 'green'
    }
}));

const TransferCard = (props) => {
    const {transaction, fromAccountId} = props;

    const classes = useStyles();

    const getValueClass = (categoryType) => {
        if (categoryType === 'TransferExpense') {
            return classes.red;
        } else if (categoryType === 'TransferIncome') {
            return classes.green;
        }
    };

    const getTransferCaption = (transaction) => {
        if (transaction.category_type === 'TransferExpense') {
            return `Transfer to ${transaction.account_name}`;
        } else {
            return `Transfer from ${transaction.from_account_name}`;
        }
    };

    return (
        <Card key={transaction.id} variant='outlined' className={classes.card}>
            <CardHeader
                action={
                    <IconButton
                        component={Link}
                        to={`/transfers/${transaction.id}/from/${fromAccountId}`}
                    >
                        <CreateIcon/>
                    </IconButton>
                }
                title={
                    <Typography
                        variant='h6'
                        className={getValueClass(transaction.category_type)}
                    >
                        {transaction.value}
                    </Typography>
                }
                subheader={
                    <>
                        {
                            transaction.description !== '' ? <>
                                <b>Description:</b> {transaction.description}<br/></> : <></>
                        }
                        <b>{getTransferCaption(transaction)}</b>
                        <br/>
                        <b>Date:</b> {moment(transaction.date).format('DD/MM/YYYY HH:mm')}
                    </>
                }
            />
        </Card>
    );
};

export default TransferCard;