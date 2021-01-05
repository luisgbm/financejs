import React from 'react';
import { Link } from 'react-router-dom'

class Home extends React.Component {
    render() {
        return (
            <div>
                <h1>Finance</h1>
                <Link to='/accounts'>Accounts</Link>
                <br />
                <Link to='/categories'>Categories</Link>
            </div>
        );
    }
}

export default Home;
