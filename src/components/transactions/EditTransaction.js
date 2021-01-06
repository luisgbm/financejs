import React from 'react';
import finance from '../../api/finance';

import { Link } from "react-router-dom";
import moment from 'moment';

class EditTransaction extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.state = {
            transactionId: props.match.params.transactionId,
            value: 0,
            description: '',
            date: moment().format("YYYY-MM-DDThh:mm:ss"),
            account: 0,
            accounts: [],
            category: 0,
            categories: []
        };
    }

    async componentDidMount() {
        const transaction = await finance.get(`/transactions/${this.state.transactionId}`);
        const categories = await finance.get('/categories');
        const accounts = await finance.get('/accounts');

        this.setState({
            categories: categories.data,
            accounts: accounts.data,
            value: transaction.data.value,
            description: transaction.data.description,
            date: transaction.data.date,
            account: transaction.data.account,
            category: transaction.data.category
        });
    }

    async onSubmit(event) {
        event.preventDefault();

        await finance.patch(`/transactions/${this.state.transactionId}`, {
            value: parseInt(this.state.value),
            description: this.state.description,
            date: this.state.date,
            account: parseInt(this.state.account),
            category: parseInt(this.state.category)
        });

        this.props.history.push(`/transactions/account/${this.state.account}`);
    }

    async onDelete() {
        await finance.delete(`/transactions/${this.state.transactionId}`);

        this.props.history.push(`/transactions/account/${this.state.account}`);
    }

    onChangeValue(event, fieldName) {
        if (fieldName === 'value') {
            this.setState({ value: event.target.value });
        } else if (fieldName === 'description') {
            this.setState({ description: event.target.value });
        } else if (fieldName === 'account') {
            this.setState({ account: event.target.value });
        } else if (fieldName === 'category') {
            this.setState({ category: event.target.value });
        } else if (fieldName === 'date') {
            this.setState({ date: event.target.value });
        }
    }

    render() {
        return (
            <div>
                <h1>Edit Transaction - Account {this.state.account}</h1>
                <form onSubmit={this.onSubmit}>
                    <label>
                        Value:
                        <input type="number" value={this.state.value} onChange={event => this.onChangeValue(event, 'value')} />
                    </label>
                    <label>
                        Description:
                        <input type="text" value={this.state.description} onChange={event => this.onChangeValue(event, 'description')} />
                    </label>
                    <label>
                        Account:
                        <select value={this.state.account} onChange={event => this.onChangeValue(event, 'account')}>
                            {
                                this.state.accounts.map(account =>
                                    <option value={account.id} key={account.id}>{account.name}</option>
                                )
                            }
                        </select>
                    </label>
                    <label>
                        Category:
                        <select value={this.state.category} onChange={event => this.onChangeValue(event, 'category')}>
                        {
                            this.state.categories.map(category =>
                               <option value={category.id} key={category.id}>{category.name}</option>
                            )
                        }
                        </select>
                    </label>
                    <label>
                        Date/Time:
                        <input type="datetime-local" step="1" value={this.state.date} onChange={event => this.onChangeValue(event, 'date')} />
                    </label>
                    <input type="submit" value="Submit" />
                    <input type="button" value="Delete" onClick={this.onDelete} />
                </form>
                <Link to={`/transactions/account/${this.state.account}`}>Back</Link>
            </div>
        );
    }
}

export default EditTransaction;
