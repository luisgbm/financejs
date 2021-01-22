import {authenticationService} from "./authentication.service";

const getAllAccounts = async () => {
    try {
        return await authenticationService.getWithAuth('/accounts');
    } catch (e) {
        console.log(e);
        throw(e);
    }
};

const getAccountById = async (accountId) => {
    try {
        return await authenticationService.getWithAuth(`/accounts/${accountId}`);
    } catch (e) {
        throw(e);
    }
};

const newAccount = async (name) => {
    try {
        return await authenticationService.postWithAuth('/accounts', {
            name
        });
    } catch (e) {
        throw(e);
    }
};

const editAccountById = async (accountId, name) => {
    try {
        return await authenticationService.patchWithAuth(`/accounts/${accountId}`, {
            name
        });
    } catch (e) {
        throw(e);
    }
};

const deleteAccountById = async (accountId) => {
    try {
        return await authenticationService.deleteWithAuth(`/accounts/${accountId}`);
    } catch (e) {
        throw(e);
    }
};

export const accountService = {
    getAllAccounts,
    getAccountById,
    newAccount,
    editAccountById,
    deleteAccountById
};
