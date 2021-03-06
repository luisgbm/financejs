import {Badge, Card, CardHeader, IconButton, ListItemIcon, makeStyles} from "@material-ui/core";
import CreateIcon from "@material-ui/icons/Create";
import Typography from "@material-ui/core/Typography";
import {moneyFormat} from "../../utils/utils";
import React from "react";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import {Link} from "react-router-dom";
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

    const transactionIsDue = (date) => {
        let dateMoment = moment(date);
        let today = moment();

        return today.isSameOrBefore(dateMoment);
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
                                      to={scheduledTransaction.kind === 'Transaction' ? `/scheduled-transactions/edit/${scheduledTransaction.id}` : `/scheduled-transfers/edit/${scheduledTransaction.id}`}>
                                <ListItemIcon>
                                    <CreateIcon/>
                                </ListItemIcon>
                                Edit
                            </MenuItem>
                            <MenuItem component={Link}
                                      to={scheduledTransaction.kind === 'Transaction' ? `/scheduled-transactions/pay/${scheduledTransaction.id}` : `/scheduled-transfers/pay/${scheduledTransaction.id}`}>
                                <ListItemIcon>
                                    <AttachMoneyIcon/>
                                </ListItemIcon>
                                Pay
                            </MenuItem>
                        </Menu>
                    </>
                }
                title={
                    <Badge variant="dot" color="secondary" invisible={transactionIsDue(scheduledTransaction.next_date)}>
                        <Typography
                            variant='h6'
                            className={getValueClass(scheduledTransaction.category_type)}
                        >
                            {moneyFormat(scheduledTransaction.value)}
                        </Typography>
                    </Badge>
                }
                subheader={
                    <>
                        {
                            scheduledTransaction.description !== '' ? <>
                                <b>Description:</b> {scheduledTransaction.description}<br/></> : <></>
                        }
                        {
                            scheduledTransaction.kind === 'Transaction' ? <>
                                <b>Account:</b> {scheduledTransaction.account_name}<br/></> : <></>
                        }
                        {
                            scheduledTransaction.kind === 'Transaction' ? <>
                                <b>Category:</b> {scheduledTransaction.category_name} ({scheduledTransaction.category_type})<br/></> : <></>
                        }
                        {
                            scheduledTransaction.kind === 'Transfer' ? <>
                                <b>To:</b> {scheduledTransaction.destination_account_name}<br/></> : <></>
                        }
                        {
                            scheduledTransaction.kind === 'Transfer' ? <>
                                <b>From:</b> {scheduledTransaction.origin_account_name}<br/></> : <></>
                        }
                        {
                            scheduledTransaction.repeat === true ? <>
                                <em>Payment {scheduledTransaction.current_repeat_count + 1} of {scheduledTransaction.infinite_repeat ? '(infinite)' : scheduledTransaction.end_after_repeats}</em></> : <></>
                        }
                    </>
                }
            />
        </Card>
    );
};

export default ScheduledTransactionCard;