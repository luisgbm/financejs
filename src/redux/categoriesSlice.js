const initialState = [];

const categoriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'addCategory': {
            return [
                ...state,
                action.payload
            ];
        }
        case 'setCategories': {
            return action.payload;
        }
        case 'editCategory': {
            return state.map(category => {
                if (category.id === parseInt(action.payload.id)) {
                    return action.payload;
                }

                return category;
            });
        }
        case 'deleteCategory': {
            return state.filter(category => category.id !== action.payload);
        }
        default:
            return state;
    }
};

export {
    categoriesReducer
}