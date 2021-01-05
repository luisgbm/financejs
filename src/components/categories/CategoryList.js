import React from 'react';
import finance from '../../api/finance';

import { Link } from 'react-router-dom'

class CategoryList extends React.Component {
    state = { categories: [] };

    async componentDidMount() {
        const response = await finance.get('/categories');
        this.setState({ categories: response.data} );
    }

    render() {
        return (
            <div>
                <h1>Categories</h1>
                <ul>
                {
                    this.state.categories.map(category =>
                        <li key={category.id}>{category.name} ({category.categorytype}) <Link to={`/categories/edit/${category.id}`}>Edit</Link></li>
                    )
                }
                </ul>
                <Link to='/categories/new'>New Category</Link>
                <br />
                <Link to='/'>Home</Link>
            </div>
        );
    }
}

export default CategoryList;
