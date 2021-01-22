import React from 'react';

import {Link} from 'react-router-dom'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import {Add} from '@material-ui/icons';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import {Card, CardHeader, Container, IconButton, Tab, Tabs} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import LoadingModal from "../LoadingModal";
import {categoryService} from "../../api/category.service";

class CategoryList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            currentTab: props.match.params.type ? (props.match.params.type === 'expense' ? 0 : 1) : 0,
            showLoadingModal: true
        };

        this.onChangeTab = this.onChangeTab.bind(this);
    }

    async componentDidMount() {
        try {
            const response = await categoryService.getAllCategories();

            this.setState({
                categories: response.data,
                showLoadingModal: false
            });
        } catch (e) {
            if (e.response.status === 401) {
                this.props.history.push('/');
            }
        }
    }

    onChangeTab(event, newValue) {
        this.setState({
            currentTab: newValue
        });
    }

    render() {
        return (
            <React.Fragment>
                <LoadingModal
                    show={this.state.showLoadingModal}
                />
                <AppBar position='sticky'>
                    <Toolbar>
                        <Typography variant='h6' className='appBarTitle'>Categories</Typography>
                        <IconButton color='inherit' component={Link}
                                    to={`/categories/new/${this.state.currentTab === 0 ? 'expense' : 'income'}`}>
                            <Add/>
                        </IconButton>
                    </Toolbar>
                    <Tabs value={this.state.currentTab} onChange={this.onChangeTab} centered>
                        <Tab icon={<ThumbDownIcon/>} label='Expenses'/>
                        <Tab icon={<ThumbUpIcon/>} label='Incomes'/>
                    </Tabs>
                </AppBar>
                <Container maxWidth='sm' style={{paddingTop: '16px'}}>
                    {
                        this.state.categories
                            .filter(category => this.state.currentTab === 0 ?
                                category.categorytype === 'Expense' :
                                category.categorytype === 'Income')
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map(category =>
                                <Card key={category.id} variant='outlined' style={{'marginBottom': '16px'}}>
                                    <CardHeader
                                        action={
                                            <IconButton component={Link} to={`/categories/edit/${category.id}`}>
                                                <CreateIcon/>
                                            </IconButton>
                                        }
                                        title={<Typography variant='h6'>{category.name}</Typography>}
                                    />
                                </Card>
                            )
                    }
                </Container>
            </React.Fragment>
        );
    }
}

export default CategoryList;
