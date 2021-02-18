import * as yup from "yup";
import moment from "moment";

const scheduledTransactionValidationSchema = yup.object({
    accountId: yup
        .string('Select the account')
        .required('Account is required'),
    value: yup
        .string('Enter the value')
        .required('Value is required'),
    categoryType: yup
        .string('Select the category type')
        .required('Type is required'),
    categoryId: yup
        .string('Select the category')
        .required('Category is required'),
    repeat: yup
        .boolean(),
    repeatFreq: yup
        .string()
        .when('repeat', {
            is: true,
            then: yup.string().required('Frequency is required')
        }),
    repeatInterval: yup
        .string()
        .when('repeat', {
            is: true,
            then: yup.string().required('Interval is required')
        }),
    infiniteRepeat: yup
        .boolean(),
    endAfterRepeats: yup
        .string()
        .when('repeat', {
            is: true,
            then: yup.string().when('infiniteRepeat', {
                is: false,
                then: yup.string().required('End After Repetitions is required')
            })
        })
});

const scheduledTransactionInitialValues = {
    value: '',
    description: '',
    accountId: '',
    categoryType: '',
    categoryId: '',
    createdDate: moment(),
    repeat: false,
    repeatFreq: '',
    repeatInterval: '',
    infiniteRepeat: false,
    endAfterRepeats: ''
};

export {
    scheduledTransactionValidationSchema,
    scheduledTransactionInitialValues
} ;