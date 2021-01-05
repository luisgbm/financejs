import React from 'react';
import finance from '../../api/finance';

import { Link } from "react-router-dom";

class EditCategory extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.state = { name: '', categoryType: '', id: props.match.params.id };
    }

    async componentDidMount() {
        const response = await finance.get(`/categories/${this.state.id}`);
        this.setState({ name: response.data.name, categoryType: response.data.categorytype });
    }

    async onSubmit(event) {
        event.preventDefault();

        await finance.patch(`/categories/${this.state.id}`, {
            name: this.state.name,
            categorytype: this.state.categoryType
        });

        this.props.history.push('/categories');
    }

    async onDelete() {
        await finance.delete(`/categories/${this.state.id}`);

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
                <h1>Edit Category</h1>
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
                    <input type="button" value="Delete" onClick={this.onDelete} />
                </form>
                <Link to="/categories">Back</Link>
            </div>
        );
    }
}

export default EditCategory;
