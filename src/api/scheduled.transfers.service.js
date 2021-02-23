import {authenticationService} from "./authentication.service";

const getScheduledTransferById = async (scheduledTransferId) => {
    const scheduledTransfer = await authenticationService.getWithAuth(`/scheduled-transfers/${scheduledTransferId}`);
    return scheduledTransfer.data;
};

const newScheduledTransfer = async (originAccountId, destinationAccountId, value, description, createdDate, repeat, repeatFreq, repeatInterval, infiniteRepeat, endAfterRepeats) => {
    const scheduledTransfer = await authenticationService.postWithAuth(`/scheduled-transfers`, {
        origin_account_id: originAccountId,
        destination_account_id: destinationAccountId,
        value,
        description,
        created_date: createdDate,
        repeat,
        repeat_freq: repeat ? repeatFreq : null,
        repeat_interval: repeat ? repeatInterval : null,
        infinite_repeat: repeat ? infiniteRepeat : null,
        end_after_repeats: repeat ? (infiniteRepeat ? null : endAfterRepeats) : null
    });

    return scheduledTransfer.data;
};

const payScheduledTransfer = async (scheduledTransferId, originAccountId, destinationAccountId, value, description, date) => {
    const transfer = await authenticationService.postWithAuth(`/scheduled-transfers/${scheduledTransferId}/pay`, {
        origin_account_id: originAccountId,
        destination_account_id: destinationAccountId,
        value,
        description,
        date
    });

    return transfer.data;
};

const editScheduledTransferById = async (scheduledTransferId, originAccountId, destinationAccountId, value, description, createdDate, repeat, repeatFreq, repeatInterval, infiniteRepeat, endAfterRepeats) => {
    const scheduledTransfer = await authenticationService.patchWithAuth(`/scheduled-transfers/${scheduledTransferId}`, {
        origin_account_id: originAccountId,
        destination_account_id: destinationAccountId,
        value,
        description,
        created_date: createdDate,
        repeat,
        repeat_freq: repeat ? repeatFreq : null,
        repeat_interval: repeat ? repeatInterval : null,
        infinite_repeat: repeat ? infiniteRepeat : null,
        end_after_repeats: repeat ? (infiniteRepeat ? null : endAfterRepeats) : null
    });

    return scheduledTransfer.data;
};

const deleteScheduledTransferById = async (scheduledTransferId) => {
    const scheduledTransfer = await authenticationService.deleteWithAuth(`/scheduled-transfers/${scheduledTransferId}`);
    return scheduledTransfer.data;
};

export const scheduledTransferService = {
    getScheduledTransferById,
    newScheduledTransfer,
    payScheduledTransfer,
    editScheduledTransferById,
    deleteScheduledTransferById
};