import React from 'react';

import TransactionForm from './TransactionForm';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import SaveIcon from '@material-ui/icons/Save';
import {Button, Container, IconButton} from '@material-ui/core';
import CategoryTypes from '../categories/CategoryTypes';
import moment from 'moment';
import DeleteIcon from '@material-ui/icons/Delete';
import LoadingModal from "../LoadingModal";
import {transactionService} from "../../api/transaction.service";
import {categoryService} from "../../api/category.service";
import {accountService} from "../../api/account.service";

class EditTransaction extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            transactionId: this.props.match.params.transactionId,
            value: 0,
            description: '',
            accounts: [],
            accountId: '',
            accountName: '',
            categoryType: CategoryTypes.EXPENSE,
            categories: [],
            categoryId: '',
            categoryName: '',
            date: moment(),
            showLoadingModal: true
        };

        this.onEditTransaction = this.onEditTransaction.bind(this);
        this.onChange = this.onChange.bind(this);
        this.updateCategoriesAndSelectFirst = this.updateCategoriesAndSelectFirst.bind(this);
        this.onDeleteTransaction = this.onDeleteTransaction.bind(this);
    }

    async onDeleteTransaction() {
        try {
            this.setState({showLoadingModal: true});

            await transactionService.deleteTransactionById(this.state.transactionId);

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
            const transaction = await transactionService.getTransactionById(this.state.transactionId);

            this.setState({
                value: transaction.data.value,
                description: transaction.data.description,
                date: moment(transaction.data.date),
                accountId: transaction.data.account_id,
                accountName: transaction.data.account_name,
                categoryId: transaction.data.category_id,
                categoryName: transaction.data.category_name,
                categoryType: transaction.data.category_type
            });

            const categories = await categoryService.getAllCategoriesByType(this.state.categoryType.toLowerCase());
            const accounts = await accountService.getAllAccounts();

            this.setState({
                categories: categories.data,
                accounts: accounts.data,
                showLoadingModal: false
            });
        } catch (e) {
            if (e.response.status === 401) {
                this.props.history.push('/');
            }
        }
    }

    async onEditTransaction() {
        try {
            this.setState({showLoadingModal: true});

            await transactionService.editTransactionById(
                this.state.transactionId,
                parseInt(this.state.value),
                this.state.description,
                this.state.date.format('YYYY-MM-DDTHH:mm:ss'),
                parseInt(this.state.accountId),
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

    async onChange(fieldName, fieldValue) {
        this.setState({[fieldName]: fieldValue});

        if (fieldName === 'categoryType') {
            await this.updateCategoriesAndSelectFirst(fieldValue);
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
                        <Typography variant='h6' className='appBarTitle'>Edit Transaction</Typography>
                        <IconButton color='inherit' onClick={this.onEditTransaction}>
                            <SaveIcon/>
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
                    <Button
                        variant='contained'
                        color='secondary'
                        startIcon={<DeleteIcon/>}
                        size='large'
                        style={{width: '100%'}}
                        onClick={this.onDeleteTransaction}
                    >
                        Delete
                    </Button>
                </Container>
            </React.Fragment>
        );
    }
}

export default EditTransaction;
