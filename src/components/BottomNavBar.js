import React from "react";
import {Link, useLocation} from "react-router-dom";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import HomeIcon from "@material-ui/icons/Home";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import SettingsIcon from "@material-ui/icons/Settings";

const BottomNavBar = () => {
    const [value, setValue] = React.useState(0);
    const [hide, setHide] = React.useState(false);

    let location = useLocation();

    React.useEffect(() => {
        const hideForPaths = ['/', '/users/new'];

        if (hideForPaths.includes(location.pathname)) {
            setHide(true);
            setValue(0);
        } else {
            setHide(false);
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
                />
                <BottomNavigationAction
                    label='Categories'
                    icon={<ImportExportIcon/>}
                    component={Link}
                    to={'/categories'}
                />
                <BottomNavigationAction
                    label='Settings'
                    icon={<SettingsIcon/>}
                    component={Link}
                    to={'/settings'}
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