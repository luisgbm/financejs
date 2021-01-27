import React from 'react';
import NewAccount from './accounts/NewAccount';
import EditAccount from './accounts/EditAccount';
import CategoryList from './categories/CategoryList';
import NewCategory from './categories/NewCategory';
import EditCategory from './categories/EditCategory';
import TransactionList from './transactions/TransactionList';
import NewTransaction from './transactions/NewTransaction';
import EditTransaction from './transactions/EditTransaction';
import CssBaseline from '@material-ui/core/CssBaseline';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import HomeIcon from '@material-ui/icons/Home';
import {BrowserRouter as Router, Link, Route, Switch, useLocation} from 'react-router-dom';
import AccountList from './accounts/AccountList';
import {createMuiTheme, ThemeProvider} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import Settings from './Settings';
import NewUser from './users/NewUser';
import EditTransfer from "./transactions/EditTransfer";
import Login from "./users/Login";

const theme = createMuiTheme({
    palette: {
        type: 'light',
    }
});

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
}

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Router>
                <Switch>
                    <Route exact path='/accounts' component={AccountList}/>
                    <Route exact path='/accounts/new' component={NewAccount}/>
                    <Route exact path='/accounts/edit/:id' component={EditAccount}/>
                    <Route exact path='/categories/new/:type' component={NewCategory}/>
                    <Route exact path='/categories/edit/:id' component={EditCategory}/>
                    <Route exact path='/categories/' component={CategoryList}/>
                    <Route exact path='/categories/:type' component={CategoryList}/>
                    <Route exact path='/transactions/account/:accountId' component={TransactionList}/>
                    <Route exact path='/transactions/account/:accountId/new' component={NewTransaction}/>
                    <Route exact path='/transactions/:transactionId' component={EditTransaction}/>
                    <Route exact path='/' component={Login}/>
                    <Route exact path='/settings' component={Settings}/>
                    <Route exact path='/users/new' component={NewUser}/>
                    <Route exact path='/transfers/:transferId/from/:fromAccountId' component={EditTransfer}/>
                </Switch>
                <BottomNavBar/>
            </Router>
        </ThemeProvider>
    );
}

export default App;
