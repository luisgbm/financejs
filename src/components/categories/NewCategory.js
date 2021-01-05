import React from 'react';
import finance from '../../api/finance';

import { Link } from "react-router-dom";

class NewCategory extends React.Component {
    state = { name: '', categoryType: 'Expense' };

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
    }

    async onSubmit(event) {
        event.preventDefault();

        await finance.post('/categories', {
            name: this.state.name,
            categorytype: this.state.categoryType
        });

        this.props.history.push('/categories');
    }

    onChangeName(event) {
        this.setState({ name: event.target.value });
    }

    onChangeType(event) {
        this.setState({ categoryType: event.target.value });
    }

    render() {
        return (
            <div>
                <h1>New Category</h1>
                <form onSubmit={this.onSubmit}>
                    <label>
                        Name:
                        <input type="text" value={this.state.name} onChange={this.onChangeName} />
                    </label>
                    <label>
                        Type:
                        <select value={this.state.categoryType} onChange={this.onChangeType}>
                            <option value="Expense">Expense</option>
                            <option value="Income">Income</option>
                        </select>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <Link to="/categories">Back</Link>
            </div>
        );
    }
}

export default NewCategory;
