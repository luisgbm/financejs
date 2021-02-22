import React from "react";
import {Link, useLocation} from "react-router-dom";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import HomeIcon from "@material-ui/icons/Home";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import SettingsIcon from "@material-ui/icons/Settings";
import EventIcon from "@material-ui/icons/Event";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    bottomNav: {
        zIndex: theme.zIndex.drawer + 1,
        width: '100%',
        position: 'fixed',
        bottom: '0'
    }
}));

const BottomNavBar = () => {
    const [value, setValue] = React.useState('home');
    const [hide, setHide] = React.useState(false);

    let location = useLocation();

    const classes = useStyles();

    React.useEffect(() => {
        const hideForPaths = ['/', '/users/new'];

        if (hideForPaths.includes(location.pathname)) {
            setHide(true);
        } else {
            setHide(false);
        }

        if (location.pathname.startsWith('/categories')) {
            setValue('categories');
        } else if (location.pathname.startsWith('/settings')) {
            setValue('settings');
        } else if (location.pathname.startsWith('/accounts')) {
            setValue('home');
        } else if (location.pathname.startsWith('/transactions')) {
            setValue('home');
        } else if (location.pathname.startsWith('/transfers')) {
            setValue('home');
        } else if (location.pathname.startsWith('/scheduled-transactions')) {
            setValue('scheduled-transactions');
        }
    }, [location]);

    if (!hide) {
        return (
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                showLabels
                className={classes.bottomNav}
            >
                <BottomNavigationAction
                    label='Home'
                    icon={<HomeIcon/>}
                    component={Link}
                    to={'/accounts'}
                    value={'home'}
                />
                <BottomNavigationAction
                    label='Schedule'
                    icon={<EventIcon/>}
                    component={Link}
                    to={'/scheduled-transactions'}
                    value={'scheduled-transactions'}
                />
                <BottomNavigationAction
                    label='Categories'
                    icon={<ImportExportIcon/>}
                    component={Link}
                    to={'/categories'}
                    value={'categories'}
                />
                <BottomNavigationAction
                    label='Settings'
                    icon={<SettingsIcon/>}
                    component={Link}
                    to={'/settings'}
                    value={'settings'}
                />
            </BottomNavigation>
        );
    } else {
        return (
            <></>
        );
    }
};

export default BottomNavBar;