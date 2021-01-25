import {authenticationService} from "./authentication.service";

const newTransfer = async (value, description, from, to, date) => {
    try {
        return await authenticationService.postWithAuth(`/transfers/from/${from}/to/${to}`, {
            value,
            description,
            date
        });
    } catch (e) {
        throw(e);
    }
};

export const transactionService = {
    newTransfer
};
