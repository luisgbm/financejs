import React from 'react';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import {Container, IconButton} from '@material-ui/core';
import TransactionForm from './TransactionForm';
import finance from '../../api/finance';
import CategoryTypes from '../categories/CategoryTypes';
import DoneIcon from '@material-ui/icons/Done';
import moment from 'moment';

class NewTransaction extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0,
            description: '',
            accounts: [],
            accountId: '',
            categoryType: CategoryTypes.EXPENSE,
            categories: [],
            categoryId: '',
            categoryName: '',
            date: moment().format('YYYY-MM-DDThh:mm:ss')
        };

        this.onChange = this.onChange.bind(this);
        this.onNewTransaction = this.onNewTransaction.bind(this);
        this.updateCategoriesAndSelectFirst = this.updateCategoriesAndSelectFirst.bind(this);
    }

    async onChange(fieldName, fieldValue) {
        this.setState({[fieldName]: fieldValue});

        if (fieldName === 'categoryType') {
            await this.updateCategoriesAndSelectFirst(fieldValue);
        }
    }

    async onNewTransaction() {
        await finance.post(`/transactions/account/${this.state.accountId}`, {
            value: parseInt(this.state.value),
            description: this.state.description,
            date: this.state.date,
            category: parseInt(this.state.categoryId)
        });

        this.props.history.push(`/transactions/account/${this.state.accountId}`);
    }

    async updateCategoriesAndSelectFirst(categoryType) {
        const categories = await finance.get(`/categories/${categoryType.toLowerCase()}`);
        this.setState({categories: categories.data});

        if (categories.data && categories.data.length) {
            this.setState({
                categoryId: categories.data[0].id,
                categoryName: categories.data[0].name
            });
        }
    }

    async componentDidMount() {
        const accounts = await finance.get('/accounts');
        this.setState({
            accounts: accounts.data,
            accountId: this.props.match.params.accountId
        });
        await this.updateCategoriesAndSelectFirst(this.state.categoryType);
    }

    render() {
        return (
            <React.Fragment>
                <AppBar position='static'>
                    <Toolbar>
                        <Typography variant='h6' className='appBarTitle'>New Transaction</Typography>
                        <IconButton color='inherit' onClick={this.onNewTransaction}>
                            <DoneIcon/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Container maxWidth='sm' style={{paddingTop: '16px'}}>
                    <TransactionForm
                        value={this.state.value}
                        description={this.state.description}
                        accounts={this.state.accounts}
                        accountId={this.state.accountId}
                        categoryType={this.state.categoryType}
                        categories={this.state.categories}
                        categoryId={this.state.categoryId}
                        date={this.state.date}
                        onChange={this.onChange}
                    />
                </Container>
            </React.Fragment>
        );
    }
}

export default NewTransaction;
