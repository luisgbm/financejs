import {combineReducers} from 'redux'
import {accountsReducer} from './accountsSlice';
import {categoriesReducer} from './categoriesSlice';

const rootReducer = combineReducers({
    accounts: accountsReducer,
    categories: categoriesReducer
})

export default rootReducer