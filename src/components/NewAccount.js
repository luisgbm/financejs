import React from 'react';
import finance from '../api/finance';

class NewAccount extends React.Component {
    state = { name: '' };

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    async onSubmit(event) {
        const response = await finance.post('/accounts', {
            name: this.state.name
        });

        event.preventDefault();
    }

    onChange(event) {
        this.setState({ name: event.target.value });
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <label htmlFor="name">Name:</label>
                <input id="name" type="text" value={this.state.value} onChange={this.onChange}></input>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

export default NewAccount;
