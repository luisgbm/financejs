import React from 'react';
import AccountList from "./AccountList";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import NewAccount from "./NewAccount";

class App extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/newAccount">
                        <NewAccount/>
                    </Route>
                    <Route path="/">
                        <AccountList/>
                    </Route>
                </Switch>
            </Router>
        );
    }
}

export default App;
