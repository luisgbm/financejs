import React from 'react';
import finance from '../../api/finance';

import {Link} from 'react-router-dom'
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import {Add} from "@material-ui/icons";
import {IconButton} from "@material-ui/core";

class CategoryList extends React.Component {
    state = {categories: []};

    async componentDidMount() {
        const response = await finance.get('/categories');
        this.setState({categories: response.data});
    }

    render() {
        return (
            <React.Fragment>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" className="appBarTitle">Categories</Typography>
                        <IconButton color="inherit" component={Link} to={'/categories/new'}>
                            <Add/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <ul>
                    {
                        this.state.categories.map(category =>
                            <li key={category.id}>{category.name} ({category.categorytype}) <Link
                                to={`/categories/edit/${category.id}`}>Edit</Link></li>
                        )
                    }
                </ul>
            </React.Fragment>
        );
    }
}

export default CategoryList;
