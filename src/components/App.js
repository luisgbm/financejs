import React from 'react';
import AccountList from "./accounts/AccountList";
import NewAccount from "./accounts/NewAccount";
import EditAccount from "./accounts/EditAccount";
import Home from "./home/Home";
import CategoryList from "./categories/CategoryList";
import NewCategory from "./categories/NewCategory";
import EditCategory from "./categories/EditCategory";
import TransactionList from "./transactions/TransactionList";
import NewTransaction from "./transactions/NewTransaction";
import EditTransaction from "./transactions/EditTransaction";

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

class App extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/accounts/new" component={NewAccount} />
                    <Route exact path="/accounts/edit/:id" component={EditAccount} />
                    <Route exact path="/accounts" component={AccountList} />
                    <Route exact path="/categories/new" component={NewCategory} />
                    <Route exact path="/categories/edit/:id" component={EditCategory} />
                    <Route exact path="/categories" component={CategoryList} />
                    <Route exact path="/transactions/account/:accountId" component={TransactionList} />
                    <Route exact path="/transactions/account/:accountId/new" component={NewTransaction} />
                    <Route exact path="/transactions/:transactionId" component={EditTransaction} />
                    <Route exact path="/" component={Home} />
                </Switch>
            </Router>
        );
    }
}

export default App;
