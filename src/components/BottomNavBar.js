import React from "react";
import {Link, useLocation} from "react-router-dom";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import HomeIcon from "@material-ui/icons/Home";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import SettingsIcon from "@material-ui/icons/Settings";

const BottomNavBar = () => {
    const [value, setValue] = React.useState('home');
    const [hide, setHide] = React.useState(false);

    let location = useLocation();

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
                className='bottomNav'
            >
                <BottomNavigationAction
                    label='Home'
                    icon={<HomeIcon/>}
                    component={Link}
                    to={'/accounts'}
                    value={'home'}
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