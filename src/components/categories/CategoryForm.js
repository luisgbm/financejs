import React from 'react';
import finance from '../../api/finance';

class CategoryForm extends React.Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.onDelete = this.onDelete.bind(this);

        this.state = {name: '', categoryType: 'Expense', id: props.categoryId, editMode: props.editMode};
    }

    async componentDidMount() {
        if (this.state.editMode) {
            const response = await finance.get(`/categories/${this.state.id}`);
            this.setState({name: response.data.name, categoryType: response.data.categorytype});
        }
    }

    async onSubmit(event) {
        event.preventDefault();

        if (this.state.editMode) {
            await finance.patch(`/categories/${this.state.id}`, {
                name: this.state.name,
                categorytype: this.state.categoryType
            });
        } else {
            await finance.post('/categories', {
                name: this.state.name,
                categorytype: this.state.categoryType
            });
        }

        this.props.history.push('/categories');
    }

    async onDelete() {
        await finance.delete(`/categories/${this.state.id}`);

        this.props.history.push('/categories');
    }

    onChangeValue(event, field) {
        if (field === 'name') {
            this.setState({name: event.target.value});
        } else if (field === 'type') {
            this.setState({categoryType: event.target.value});
        }
    }

    render() {
        return (
            <React.Fragment>
                <form onSubmit={this.onSubmit}>
                    <label>
                        Name:
                        <input type="text" value={this.state.name}
                               onChange={event => this.onChangeValue(event, 'name')}/>
                    </label>
                    <br/>
                    <label>
                        Type:
                        <select value={this.state.categoryType} onChange={event => this.onChangeValue(event, 'type')}>
                            <option value="Expense">Expense</option>
                            <option value="Income">Income</option>
                        </select>
                    </label>
                    <br/>
                    <input type="submit" value="Submit"/>
                    {
                        this.state.editMode ? <input type="button" value="Delete" onClick={this.onDelete}/> : ''
                    }
                </form>
            </React.Fragment>
        );
    }
}

export default CategoryForm;
