import {applyMiddleware, createStore} from 'redux';
import rootReducer from './reducer';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension'
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'finance',
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const composedEnhancer = composeWithDevTools(applyMiddleware(thunk));

const store = createStore(persistedReducer, composedEnhancer);
const persistor = persistStore(store);

export {
    store,
    persistor
};