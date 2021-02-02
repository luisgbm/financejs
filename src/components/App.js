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
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import AccountList from './accounts/AccountList';
import {createMuiTheme, ThemeProvider} from '@material-ui/core';
import Settings from './Settings';
import NewUser from './users/NewUser';
import EditTransfer from "./transactions/EditTransfer";
import Login from "./users/Login";
import BottomNavBar from "./BottomNavBar";

const theme = createMuiTheme({
    palette: {
        type: 'light',
    }
});

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
                    <Route exact path='/transactions/account/:accountId/new/:type' component={NewTransaction}/>
                    <Route exact path='/transactions/:transactionId' component={EditTransaction}/>
                    <Route exact path='/transfers/:transferId/from/:fromAccountId' component={EditTransfer}/>
                    <Route exact path='/' component={Login}/>
                    <Route exact path='/settings' component={Settings}/>
                    <Route exact path='/users/new' component={NewUser}/>
                </Switch>
                <BottomNavBar/>
            </Router>
        </ThemeProvider>
    );
}

export default App;
