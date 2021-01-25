import React from 'react';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import {Container, IconButton, Tab, Tabs} from '@material-ui/core';
import TransactionForm from './TransactionForm';
import CategoryTypes from '../categories/CategoryTypes';
import DoneIcon from '@material-ui/icons/Done';
import moment from 'moment';
import LoadingModal from "../LoadingModal";
import {accountService} from "../../api/account.service";
import {categoryService} from "../../api/category.service";
import {transactionService} from "../../api/transaction.service";
import AutorenewIcon from '@material-ui/icons/Autorenew';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import TransferForm from "./TransferForm";
import {transactionService as transferService} from "../../api/transfer.service";

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
            showLoadingModal: true,
            currentTab: 0,
            from: 0,
            to: 0,
            fromAccounts: [],
            toAccounts: []
        };

        this.onChange = this.onChange.bind(this);
        this.onNewTransaction = this.onNewTransaction.bind(this);
        this.onNewTransfer = this.onNewTransfer.bind(this);
        this.updateCategoriesAndSelectFirst = this.updateCategoriesAndSelectFirst.bind(this);
        this.onChangeTab = this.onChangeTab.bind(this);
    }

    async onChange(fieldName, fieldValue) {
        this.setState({[fieldName]: fieldValue});

        if (fieldName === 'categoryType') {
            await this.updateCategoriesAndSelectFirst(fieldValue);
        }
    }

    async onNewTransfer() {
        try {
            this.setState({showLoadingModal: true});

            await transferService.newTransfer(
                parseInt(this.state.value),
                this.state.description,
                this.state.from,
                this.state.to,
                this.state.date.format('yyyy-MM-DDTHH:mm:ss'),
            );

            this.setState({showLoadingModal: false});

            this.props.history.push(`/transactions/account/${this.state.accountId}`);
        } catch (e) {
            if (e.response.status === 401) {
                this.props.history.push('/');
            }
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
                fromAccounts: accounts.data,
                toAccounts: accounts.data,
                from: this.props.match.params.accountId,
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

    onChangeTab(event, newValue) {
        this.setState({
            currentTab: newValue
        });
    }

    getContainerForTab() {
        if (this.state.currentTab === 0) {
            return (
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
            );
        } else {
            return (
                <TransferForm
                    value={this.state.value}
                    description={this.state.description}
                    from={this.state.from}
                    to={this.state.to}
                    date={this.state.date}
                    fromAccounts={this.state.fromAccounts}
                    toAccounts={this.state.toAccounts}
                    onChange={this.onChange}
                />
            );
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
                        <IconButton color='inherit'
                                    onClick={this.state.currentTab === 0 ? this.onNewTransaction : this.onNewTransfer}>
                            <DoneIcon/>
                        </IconButton>
                    </Toolbar>
                    <Tabs value={this.state.currentTab} onChange={this.onChangeTab} centered>
                        <Tab icon={<AttachMoneyIcon/>} label='Regular'/>
                        <Tab icon={<AutorenewIcon/>} label='Transfer'/>
                    </Tabs>
                </AppBar>
                <Container maxWidth='sm' style={{paddingTop: '16px'}}>
                    {this.getContainerForTab()}
                </Container>
            </React.Fragment>
        );
    }
}

export default NewTransaction;
