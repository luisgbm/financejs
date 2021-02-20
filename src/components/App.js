import React from 'react';
import NewAccount from './accounts/NewAccount';
import EditAccount from './accounts/EditAccount';
import CategoryList from './categories/CategoryList';
import NewCategory from './categories/NewCategory';
import EditCategory from './categories/EditCategory';
import TransactionList from './transactions/TransactionList';
import NewTransaction from './transactions/NewTransaction';
import EditTransaction from './transactions/EditTransaction';
import CssBaseline from '@material-ui/core/CssBaseline';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import AccountList from './accounts/AccountList';
import {createMuiTheme, ThemeProvider} from '@material-ui/core';
import Settings from './Settings';
import NewUser from './users/NewUser';
import EditTransfer from "./transactions/EditTransfer";
import Login from "./users/Login";
import BottomNavBar from "./BottomNavBar";
import ScheduledTransactionsList from "./scheduled-transactions/ScheduledTransactionsList";
import NewScheduledTransaction from "./scheduled-transactions/NewScheduledTransaction";
import LoadingModal from "./LoadingModal";
import LoadingModalContext from "../context/LoadingModalContext";
import MessageModalContext from "../context/MessageModalContext";
import MessageModal from "./MessageModal";
import EditScheduledTransaction from "./scheduled-transactions/EditScheduledTransaction";
import PayScheduledTransaction from "./scheduled-transactions/PayScheduledTransaction";
import EditScheduledTransfer from "./scheduled-transactions/EditScheduledTransfer";
import PayScheduledTransfer from "./scheduled-transactions/PayScheduledTransfer";

const theme = createMuiTheme({
    palette: {
        type: 'light',
    }
});

const App = () => {
    const [loadingModalOpen, setLoadingModalOpen] = React.useState(false);
    const [messageModalOpen, setMessageModalOpen] = React.useState(false);
    const [messageModalTitle, setMessageModalTitle] = React.useState('');
    const [messageModalMessage, setMessageModalMessage] = React.useState('');

    const toggleLoadingModalOpen = () => {
        setLoadingModalOpen(prevLoadingModalOpen => !prevLoadingModalOpen);
    };

    const showMessageModal = (title, message) => {
        setMessageModalTitle(title);
        setMessageModalMessage(message);
        setMessageModalOpen(true);
    };

    const closeMessageModal = () => {
        setMessageModalOpen(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <MessageModalContext.Provider value={{showMessageModal, closeMessageModal}}>
                <LoadingModalContext.Provider value={toggleLoadingModalOpen}>
                    <CssBaseline/>
                    <LoadingModal
                        open={loadingModalOpen}
                    />
                    <MessageModal
                        open={messageModalOpen}
                        title={messageModalTitle}
                        message={messageModalMessage}
                        handleClose={() => setMessageModalOpen(false)}
                    />
                    <Router>
                        <Switch>
                            <Route exact path='/' component={Login}/>
                            <Route exact path='/settings' component={Settings}/>
                            <Route exact path='/users/new' component={NewUser}/>
                            <Route exact path='/accounts' component={AccountList}/>
                            <Route exact path='/accounts/new' component={NewAccount}/>
                            <Route exact path='/accounts/edit/:id' component={EditAccount}/>
                            <Route exact path='/categories/new/:type' component={NewCategory}/>
                            <Route exact path='/categories/edit/:id' component={EditCategory}/>
                            <Route exact path='/categories/' component={CategoryList}/>
                            <Route exact path='/categories/:type' component={CategoryList}/>
                            <Route exact path='/transactions/account/:accountId' component={TransactionList}/>
                            <Route exact path='/transactions/account/:accountId/new/:type' component={NewTransaction}/>
                            <Route exact path='/transactions/:transactionId' component={EditTransaction}/>
                            <Route exact path='/transfers/:transferId/from/:fromAccountId' component={EditTransfer}/>
                            <Route exact path='/scheduled-transactions' component={ScheduledTransactionsList}/>
                            <Route exact path='/scheduled-transactions/new/:type' component={NewScheduledTransaction}/>
                            <Route exact path='/scheduled-transactions/edit/:scheduledTransactionId'
                                   component={EditScheduledTransaction}/>
                            <Route exact path='/scheduled-transfers/edit/:scheduledTransferId'
                                   component={EditScheduledTransfer}/>
                            <Route exact path='/scheduled-transactions/pay/:scheduledTransactionId'
                                   component={PayScheduledTransaction}/>
                            <Route exact path='/scheduled-transfers/pay/:scheduledTransferId'
                                   component={PayScheduledTransfer}/>
                        </Switch>
                        <BottomNavBar/>
                    </Router>
                </LoadingModalContext.Provider>
            </MessageModalContext.Provider>
        </ThemeProvider>
    );
}

export default App;
