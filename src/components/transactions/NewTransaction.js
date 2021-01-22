import React from 'react';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import {Container, IconButton} from '@material-ui/core';
import TransactionForm from './TransactionForm';
import CategoryTypes from '../categories/CategoryTypes';
import DoneIcon from '@material-ui/icons/Done';
import moment from 'moment';
import LoadingModal from "../LoadingModal";
import {accountService} from "../../api/account.service";
import {categoryService} from "../../api/category.service";
import {transactionService} from "../../api/transaction.service";

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
            date: moment(),
            showLoadingModal: true
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
        try {
            this.setState({showLoadingModal: true});

            await transactionService.newTransaction(
                this.state.accountId,
                parseInt(this.state.value),
                this.state.description,
                this.state.date.format('yyyy-MM-DDTHH:mm:ss'),
                parseInt(this.state.categoryId)
            );

            this.setState({showLoadingModal: false});

            this.props.history.push(`/transactions/account/${this.state.accountId}`);
        } catch (e) {
            if (e.response.status === 401) {
                this.props.history.push('/');
            }
        }
    }

    async updateCategoriesAndSelectFirst(categoryType) {
        try {
            this.setState({showLoadingModal: true});

            const categories = await categoryService.getAllCategoriesByType(categoryType.toLowerCase());

            this.setState({categories: categories.data, showLoadingModal: false});

            if (categories.data && categories.data.length) {
                this.setState({
                    categoryId: categories.data[0].id,
                    categoryName: categories.data[0].name
                });
            }
        } catch (e) {
            if (e.response.status === 401) {
                this.props.history.push('/');
            }
        }
    }

    async componentDidMount() {
        try {
            const accounts = await accountService.getAllAccounts();

            this.setState({
                accounts: accounts.data,
                accountId: this.props.match.params.accountId,
                showLoadingModal: false
            });

            await this.updateCategoriesAndSelectFirst(this.state.categoryType);
        } catch (e) {
            if (e.response.status === 401) {
                this.props.history.push('/');
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <LoadingModal
                    show={this.state.showLoadingModal}
                />
                <AppBar position='sticky'>
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
