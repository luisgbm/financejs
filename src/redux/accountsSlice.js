const initialState = [];

const accountsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'addAccount': {
            return [
                ...state,
                action.payload
            ];
        }
        case 'setAccounts': {
            return action.payload;
        }
        case 'editAccount': {
            return state.map((account, index) => {
                if (account.id === parseInt(action.payload.id)) {
                    return action.payload;
                }

                return account;
            });
        }
        case 'deleteAccount': {
            return state.filter((account, index) => account.id !== action.payload);
        }
        default:
            return state;
    }
};

export {
    accountsReducer
}