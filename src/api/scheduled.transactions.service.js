import {authenticationService} from "./authentication.service";

const getAllScheduledTransactions = async () => {
    try {
        return await authenticationService.getWithAuth(`/scheduled-transactions`);
    } catch (e) {
        console.log(e);
        throw(e);
    }
};

const getScheduledTransactionById = async (scheduledTransactionId) => {
    try {
        return await authenticationService.getWithAuth(`/scheduled-transactions/${scheduledTransactionId}`);
    } catch (e) {
        throw(e);
    }
};

const newScheduledTransaction = async (accountId, value, description, categoryId, createdDate, repeat, repeatFreq, repeatInterval, infiniteRepeat, endAfterRepeats) => {
    try {
        return await authenticationService.postWithAuth(`/scheduled-transactions`, {
            account_id: accountId,
            value,
            description,
            category_id: categoryId,
            created_date: createdDate,
            repeat,
            repeat_freq: repeat ? repeatFreq : null,
            repeat_interval: repeat ? repeatInterval : null,
            infinite_repeat: repeat ? infiniteRepeat : null,
            end_after_repeats: repeat ? (infiniteRepeat ? null : endAfterRepeats) : null
        });
    } catch (e) {
        throw(e);
    }
};

const payScheduledTransaction = async (scheduledTransactionId, value, description, date, category, account) => {
    try {
        return await authenticationService.postWithAuth(`/scheduled-transactions/${scheduledTransactionId}/pay`, {
            value,
            description,
            date,
            category,
            account
        });
    } catch (e) {
        throw(e);
    }
};

const editScheduledTransactionById = async (scheduledTransactionId, accountId, value, description, categoryId, createdDate, repeat, repeatFreq, repeatInterval, infiniteRepeat, endAfterRepeats) => {
    try {
        return await authenticationService.patchWithAuth(`/scheduled-transactions/${scheduledTransactionId}`, {
            value,
            description,
            category_id: categoryId,
            created_date: createdDate,
            repeat,
            repeat_freq: repeat ? repeatFreq : null,
            repeat_interval: repeat ? repeatInterval : null,
            infinite_repeat: repeat ? infiniteRepeat : null,
            end_after_repeats: repeat ? (infiniteRepeat ? null : endAfterRepeats) : null
        });
    } catch (e) {
        throw(e);
    }
};

const deleteScheduledTransactionById = async (transactionId) => {
    try {
        return await authenticationService.deleteWithAuth(`/scheduled-transactions/${transactionId}`);
    } catch (e) {
        throw(e);
    }
};

export const scheduledTransactionService = {
    getAllScheduledTransactions,
    getScheduledTransactionById,
    newScheduledTransaction,
    payScheduledTransaction,
    editScheduledTransactionById,
    deleteScheduledTransactionById
};