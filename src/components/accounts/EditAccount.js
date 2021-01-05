import React from 'react';
import finance from '../../api/finance';

import { Link } from "react-router-dom";

class EditAccount extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.state = { name: '', id: props.match.params.id };
    }

    async componentDidMount() {
        const response = await finance.get(`/accounts/${this.state.id}`);
        this.setState({ name: response.data.name });
    }

    async onSubmit(event) {
        event.preventDefault();

        await finance.patch(`/accounts/${this.state.id}`, {
            name: this.state.name
        });

        this.props.history.push('/accounts');
    }

    async onDelete() {
        await finance.delete(`/accounts/${this.state.id}`);

        this.props.history.push('/accounts');
    }

    onChange(event) {
        this.setState({ name: event.target.value });
    }

    render() {
        return (
            <div>
                <h1>Edit Account</h1>
                <form onSubmit={this.onSubmit}>
                    <label>
                        Name:
                        <input type="text" value={this.state.name} onChange={this.onChange} />
                    </label>
                    <input type="submit" value="Submit" />
                    <input type="button" value="Delete" onClick={this.onDelete} />
                </form>
                <Link to="/accounts">Back</Link>
            </div>
        );
    }
}

export default EditAccount;
