import React from 'react';
import finance from '../../api/finance';

import {Link} from "react-router-dom";

class AccountForm extends React.Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onDelete = this.onDelete.bind(this);

        this.state = {name: '', id: props.accountId, editMode: props.editMode};
    }

    async componentDidMount() {
        if (this.state.editMode) {
            const account = await finance.get(`/accounts/${this.state.id}`);
            this.setState({name: account.data.name});
        }
    }

    async onSubmit(event) {
        event.preventDefault();

        if (this.state.editMode) {
            await finance.patch(`/accounts/${this.state.id}`, {
                name: this.state.name
            });
        } else {
            await finance.post('/accounts', {
                name: this.state.name
            });
        }

        this.props.history.push('/accounts');
    }

    async onDelete() {
        await finance.delete(`/accounts/${this.state.id}`);

        this.props.history.push('/accounts');
    }

    onChange(event) {
        this.setState({name: event.target.value});
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <label>
                        Name:
                        <input type="text" value={this.state.name} onChange={this.onChange}/>
                    </label>
                    <br/>
                    <input type="submit" value="Submit"/>
                    {
                        this.state.editMode ? <input type="button" value="Delete" onClick={this.onDelete}/> : ''
                    }
                </form>
                <Link to="/accounts">Back</Link>
            </div>
        );
    }
}

export default AccountForm;
