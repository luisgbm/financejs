import React from 'react';
import {Link} from 'react-router-dom'
import AccountList from "../accounts/AccountList";

class Home extends React.Component {
    render() {
        return (
            <div>
                <h1>Finance</h1>
                <AccountList/>
                <Link to='/categories'>Categories</Link>
            </div>
        );
    }
}

export default Home;
