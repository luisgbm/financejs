import React from 'react';
import finance from '../../api/finance';

import {Link} from "react-router-dom";
import moment from 'moment';

class TransactionForm extends React.Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.onDelete = this.onDelete.bind(this);

        this.state = {
            transactionId: props.transactionId,
            value: 0,
            description: '',
            date: moment().format("YYYY-MM-DDThh:mm:ss"),
            accountId: props.accountId,
            accountName: '',
            accounts: [],
            category: 0,
            categoryType: 'Expense',
            categoryName: '',
            categories: [],
            editMode: props.editMode
        };
    }

    async componentDidMount() {
        if (this.state.editMode) {
            const transaction = await finance.get(`/transactions/${this.state.transactionId}`);

            this.setState({
                value: transaction.data.value,
                description: transaction.data.description,
                date: transaction.data.date,
                accountId: transaction.data.account_id,
                accountName: transaction.data.account_name,
                categoryId: transaction.data.category_id,
                categoryName: transaction.data.category_name,
                categoryType: transaction.data.category_type
            });
        }

        const categories = await finance.get(`/categories/${this.state.categoryType.toLowerCase()}`);
        const accounts = await finance.get('/accounts');

        this.setState({
            categories: categories.data,
            accounts: accounts.data
        });

        if (!this.state.editMode) {
            if (this.state.categories && this.state.categories.length) {
                this.setState({
                    categoryId: this.state.categories[0].id,
                    categoryType: this.state.categories[0].categorytype,
                    categoryName: this.state.categories[0].name
                });
            }
        }
    }

    async onSubmit(event) {
        event.preventDefault();

        if (this.state.editMode) {
            await finance.patch(`/transactions/${this.state.transactionId}`, {
                value: parseInt(this.state.value),
                description: this.state.description,
                date: this.state.date,
                account: parseInt(this.state.accountId),
                category: parseInt(this.state.categoryId)
            });
        } else {
            await finance.post(`/transactions/account/${this.state.accountId}`, {
                value: parseInt(this.state.value),
                description: this.state.description,
                date: this.state.date,
                category: parseInt(this.state.categoryId)
            });
        }

        this.props.history.push(`/transactions/account/${this.state.accountId}`);
    }

    async onDelete() {
        await finance.delete(`/transactions/${this.state.transactionId}`);

        this.props.history.push(`/transactions/account/${this.state.accountId}`);
    }

    async onChangeValue(event, fieldName) {
        this.setState({[fieldName]: event.target.value});

        if (fieldName === 'categoryType') {
            const categoriesByType = await finance.get(`/categories/${event.target.value.toLowerCase()}`);
            this.setState({
                categories: categoriesByType.data
            });

            if (this.state.categories && this.state.categories.length) {
                this.setState({
                    categoryId: this.state.categories[0].id,
                    categoryName: this.state.categories[0].name
                });
            }
        }
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <label>
                        Value:
                        <input type="number" value={this.state.value}
                               onChange={event => this.onChangeValue(event, 'value')}/>
                    </label>
                    <br/>
                    <label>
                        Description:
                        <input type="text" value={this.state.description}
                               onChange={event => this.onChangeValue(event, 'description')}/>
                    </label>
                    <br/>
                    <label>
                        Account:
                        <select value={this.state.accountId} onChange={event => this.onChangeValue(event, 'accountId')}>
                            {
                                this.state.accounts.map(account =>
                                    <option value={account.id} key={account.id}>{account.name}</option>
                                )
                            }
                        </select>
                    </label>
                    <br/>
                    <label>
                        Category Type:
                        <select value={this.state.categoryType}
                                onChange={event => this.onChangeValue(event, 'categoryType')}>
                            <option value="Expense">Expense</option>
                            <option value="Income">Income</option>
                        </select>
                    </label>
                    <br/>
                    <label>
                        Category:
                        <select value={this.state.categoryId}
                                onChange={event => this.onChangeValue(event, 'categoryId')}>
                            {
                                this.state.categories.map(category =>
                                    <option value={category.id} key={category.id}>{category.name}</option>
                                )
                            }
                        </select>
                    </label>
                    <br/>
                    <label>
                        Date/Time:
                        <input type="datetime-local" step="1" value={this.state.date}
                               onChange={event => this.onChangeValue(event, 'date')}/>
                    </label>
                    <br/>
                    <input type="submit" value="Submit"/>
                    {
                        this.state.editMode ? <input type="button" value="Delete" onClick={this.onDelete}/> : ''
                    }
                </form>
                <Link to={`/transactions/account/${this.state.accountId}`}>Back</Link>
            </div>
        );
    }
}

export default TransactionForm;
