import React from 'react';
import AccountList from "./accounts/AccountList";
import NewAccount from "./accounts/NewAccount";
import EditAccount from "./accounts/EditAccount";
import Home from "./home/Home";
import CategoryList from "./categories/CategoryList";
import NewCategory from "./categories/NewCategory";
import EditCategory from "./categories/EditCategory";

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

class App extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/accounts/new" component={NewAccount} />
                    <Route path="/accounts/edit/:id" component={EditAccount} />
                    <Route path="/accounts" component={AccountList} />
                    <Route path="/categories/new" component={NewCategory} />
                    <Route path="/categories/edit/:id" component={EditCategory} />
                    <Route path="/categories" component={CategoryList} />
                    <Route path="/" component={Home} />
                </Switch>
            </Router>
        );
    }
}

export default App;
