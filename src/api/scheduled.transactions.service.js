import {authenticationService} from "./authentication.service";

const getAllScheduledTransactions = async () => {
    const scheduledTransactions = await authenticationService.getWithAuth(`/scheduled-transactions`);
    return scheduledTransactions.data;
};

const getScheduledTransactionById = async (scheduledTransactionId) => {
    const scheduledTransaction = await authenticationService.getWithAuth(`/scheduled-transactions/${scheduledTransactionId}`);
    return scheduledTransaction.data;
};

const newScheduledTransaction = async (accountId, value, description, categoryId, createdDate, repeat, repeatFreq, repeatInterval, infiniteRepeat, endAfterRepeats) => {
    const scheduledTransaction = await authenticationService.postWithAuth(`/scheduled-transactions`, {
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

    return scheduledTransaction.data;
};

const payScheduledTransaction = async (scheduledTransactionId, value, description, date, category, account) => {
    const transaction = await authenticationService.postWithAuth(`/scheduled-transactions/${scheduledTransactionId}/pay`, {
        value,
        description,
        date,
        category,
        account
    });

    return transaction.data;
};

const editScheduledTransactionById = async (scheduledTransactionId, accountId, value, description, categoryId, createdDate, repeat, repeatFreq, repeatInterval, infiniteRepeat, endAfterRepeats) => {
    const scheduledTransaction = await authenticationService.patchWithAuth(`/scheduled-transactions/${scheduledTransactionId}`, {
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

    return scheduledTransaction.data;
};

const deleteScheduledTransactionById = async (transactionId) => {
    const scheduledTransaction = await authenticationService.deleteWithAuth(`/scheduled-transactions/${transactionId}`);
    return scheduledTransaction.data;
};

export const scheduledTransactionService = {
    getAllScheduledTransactions,
    getScheduledTransactionById,
    newScheduledTransaction,
    payScheduledTransaction,
    editScheduledTransactionById,
    deleteScheduledTransactionById
};