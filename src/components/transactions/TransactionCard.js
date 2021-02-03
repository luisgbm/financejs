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

const TransactionCard = (props) => {
    const {transaction} = props;

    const classes = useStyles();

    const getValueClass = (categoryType) => {
        if (categoryType === 'Expense') {
            return classes.red;
        } else if (categoryType === 'Income') {
            return classes.green;
        }
    };

    return (
        <Card key={transaction.id} variant='outlined' className={classes.card}>
            <CardHeader
                action={
                    <IconButton
                        component={Link}
                        to={`/transactions/${transaction.id}`}
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
                        <b>Category:</b> {transaction.category_name} ({transaction.category_type})
                        <br/>
                        <b>Date:</b> {moment(transaction.date).format('DD/MM/YYYY HH:mm')}
                    </>
                }
            />
        </Card>
    );
};

export default TransactionCard;