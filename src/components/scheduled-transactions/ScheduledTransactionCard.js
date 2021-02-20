import {Card, CardHeader, IconButton, ListItemIcon, makeStyles} from "@material-ui/core";
import CreateIcon from "@material-ui/icons/Create";
import Typography from "@material-ui/core/Typography";
import {moneyFormat} from "../../utils/utils";
import moment from "moment";
import React from "react";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import {Link} from "react-router-dom";

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

const ScheduledTransactionCard = (props) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const {scheduledTransaction} = props;

    const classes = useStyles();

    const getValueClass = (categoryType) => {
        if (categoryType === 'Expense') {
            return classes.red;
        } else if (categoryType === 'Income') {
            return classes.green;
        }
    };

    return (
        <Card key={scheduledTransaction.id} variant='outlined' className={classes.card}>
            <CardHeader
                action={
                    <>
                        <IconButton onClick={handleClick}>
                            <MoreVertIcon/>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            keepMounted
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem component={Link}
                                      to={scheduledTransaction.scheduled_type === 'Transaction' ? `/scheduled-transactions/edit/${scheduledTransaction.id}` : `/scheduled-transfers/edit/${scheduledTransaction.id}`}>
                                <ListItemIcon>
                                    <CreateIcon/>
                                </ListItemIcon>
                                Edit
                            </MenuItem>
                            <MenuItem component={Link}
                                      to={scheduledTransaction.scheduled_type === 'Transaction' ? `/scheduled-transactions/pay/${scheduledTransaction.id}` : `/scheduled-transfers/pay/${scheduledTransaction.id}`}>
                                <ListItemIcon>
                                    <AttachMoneyIcon/>
                                </ListItemIcon>
                                Pay
                            </MenuItem>
                        </Menu>
                    </>
                }
                title={
                    <Typography
                        variant='h6'
                        className={getValueClass(scheduledTransaction.category_type)}
                    >
                        {moneyFormat(scheduledTransaction.value)}
                    </Typography>
                }
                subheader={
                    <>
                        {
                            scheduledTransaction.description !== '' ? <>
                                <b>Description:</b> {scheduledTransaction.description}<br/></> : <></>
                        }
                        {
                            scheduledTransaction.scheduled_type === 'Transaction' ? <>
                                <b>Account:</b> {scheduledTransaction.account_name}<br/></> : <></>
                        }
                        {
                            scheduledTransaction.scheduled_type === 'Transaction' ? <>
                                <b>Category:</b> {scheduledTransaction.category_name} ({scheduledTransaction.category_type})<br/></> : <></>
                        }
                        {
                            scheduledTransaction.scheduled_type === 'Transfer' ? <>
                                <b>To:</b> {scheduledTransaction.destination_account_name}<br/></> : <></>
                        }
                        {
                            scheduledTransaction.scheduled_type === 'Transfer' ? <>
                                <b>From:</b> {scheduledTransaction.origin_account_name}<br/></> : <></>
                        }
                        <b>Next Date:</b> {moment(scheduledTransaction.next_date).format('DD/MM/YYYY HH:mm')}
                    </>
                }
            />
        </Card>
    );
};

export default ScheduledTransactionCard;