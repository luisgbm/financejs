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
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import AccountList from './accounts/AccountList';
import {createMuiTheme, ThemeProvider} from '@material-ui/core';

const theme = createMuiTheme({
    palette: {
        type: 'light',
    }
});

function App() {
    const [value, setValue] = React.useState(0);

    return (
        <ThemeProvider theme={theme}>
            <React.Fragment>
                <CssBaseline/>
                <Router>
                    <Switch>
                        <Route exact path='/accounts/new' component={NewAccount}/>
                        <Route exact path='/accounts/edit/:id' component={EditAccount}/>
                        <Route exact path='/categories/new/:type' component={NewCategory}/>
                        <Route exact path='/categories/edit/:id' component={EditCategory}/>
                        <Route exact path='/categories/' component={CategoryList}/>
                        <Route exact path='/categories/:type' component={CategoryList}/>
                        <Route exact path='/transactions/account/:accountId' component={TransactionList}/>
                        <Route exact path='/transactions/account/:accountId/new' component={NewTransaction}/>
                        <Route exact path='/transactions/:transactionId' component={EditTransaction}/>
                        <Route exact path='/' component={AccountList}/>
                    </Switch>
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
                            to={'/'}
                        />
                        <BottomNavigationAction
                            label='Categories'
                            icon={<ImportExportIcon/>}
                            component={Link}
                            to={'/categories'}
                        />
                    </BottomNavigation>
                </Router>
            </React.Fragment>
        </ThemeProvider>
    );
}

export default App;
