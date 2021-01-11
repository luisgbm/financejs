import React from 'react';
import finance from '../../api/finance';

import {withStyles} from '@material-ui/core/styles';
import {Link} from 'react-router-dom'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import {Add} from '@material-ui/icons';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import {Card, CardHeader, IconButton, Tab, Tabs} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import LoadingModal from "../LoadingModal";

const styles = theme => ({
    card: {
        margin: theme.spacing(2)
    }
});

class CategoryList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            currentTab: props.match.params.type === 'expense' ? 0 : 1,
            showLoadingModal: true
        };

        this.onChangeTab = this.onChangeTab.bind(this);
    }

    async componentDidMount() {
        const response = await finance.get('/categories');

        this.setState({
            categories: response.data,
            showLoadingModal: false
        });
    }

    onChangeTab(event, newValue) {
        this.setState({
            currentTab: newValue
        });
    }

    render() {
        const {classes} = this.props;

        return (
            <React.Fragment>
                <LoadingModal
                    show={this.state.showLoadingModal}
                />
                <AppBar position='static'>
                    <Toolbar>
                        <Typography variant='h6' className='appBarTitle'>Categories</Typography>
                        <IconButton color='inherit' component={Link}
                                    to={`/categories/new/${this.state.currentTab === 0 ? 'expense' : 'income'}`}>
                            <Add/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <AppBar position='static'>
                    <Tabs value={this.state.currentTab} onChange={this.onChangeTab} centered>
                        <Tab icon={<ThumbDownIcon/>} label='Expenses'/>
                        <Tab icon={<ThumbUpIcon/>} label='Incomes'/>
                    </Tabs>
                </AppBar>
                {
                    this.state.categories
                        .filter(category => this.state.currentTab === 0 ?
                            category.categorytype === 'Expense' :
                            category.categorytype === 'Income')
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(category =>
                            <Card className={classes.card} variant='outlined'>
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
            </React.Fragment>
        );
    }
}

export default withStyles(styles, {withTheme: true})(CategoryList);
