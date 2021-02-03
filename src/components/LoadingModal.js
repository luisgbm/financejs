import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const LoadingModal = (props) => {
    const {open} = props;
    const classes = useStyles();

    return (
        <Backdrop open={open} className={classes.backdrop}>
            <CircularProgress color='inherit'/>
        </Backdrop>
    );
}

export default LoadingModal;
