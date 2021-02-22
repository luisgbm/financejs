import {combineReducers} from 'redux'
import {accountsReducer} from './accountsSlice';

const rootReducer = combineReducers({
    accounts: accountsReducer
})

export default rootReducer