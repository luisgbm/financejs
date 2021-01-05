import React from 'react';
import finance from '../../api/finance';

import { Link } from "react-router-dom";

class NewAccount extends React.Component {
    state = { name: '' };

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    async onSubmit(event) {
        event.preventDefault();

        await finance.post('/accounts', {
            name: this.state.name
        });

        this.props.history.push('/accounts');
    }

    onChange(event) {
        this.setState({ name: event.target.value });
    }

    render() {
        return (
            <div>
                <h1>New Account</h1>
                <form onSubmit={this.onSubmit}>
                    <label>
                        Name:
                        <input type="text" value={this.state.name} onChange={this.onChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <Link to="/accounts">Back</Link>
            </div>
        );
    }
}

export default NewAccount;
