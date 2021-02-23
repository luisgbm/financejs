import {combineReducers} from 'redux'
import {accountsReducer} from './accountsSlice';
import {categoriesReducer} from './categoriesSlice';
import {scheduledTransactionsReducer} from './scheduledTransactionsSlice';

const rootReducer = combineReducers({
    accounts: accountsReducer,
    categories: categoriesReducer,
    scheduledTransactions: scheduledTransactionsReducer
})

export default rootReducer