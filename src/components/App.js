import React from 'react';
import AccountList from "./accounts/AccountList";
import NewAccount from "./accounts/NewAccount";
import EditAccount from "./accounts/EditAccount";

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Home from "./home/Home";

class App extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/new-account" component={NewAccount} />
                    <Route path="/edit-account/:id" component={EditAccount} />
                    <Route path="/accounts" component={AccountList} />
                    <Route path="/" component={Home} />
                </Switch>
            </Router>
        );
    }
}

export default App;
