import * as yup from "yup";
import moment from "moment";

const scheduledTransferValidationSchema = yup.object({
    originAccountId: yup
        .string('Select the From account')
        .required('From Account is required'),
    destinationAccountId: yup
        .string('Select the To account')
        .test('differentOriginAccountId', 'To and From must be different', function (value) {
            return value !== this.options.parent.originAccountId;
        })
        .required('To Account is required'),
    value: yup
        .string('Enter the value')
        .required('Value is required'),
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

const scheduledTransferInitialValues = {
    value: '',
    description: '',
    originAccountId: '',
    destinationAccountId: '',
    createdDate: moment(),
    repeat: false,
    repeatFreq: '',
    repeatInterval: '',
    infiniteRepeat: false,
    endAfterRepeats: ''
};

export {
    scheduledTransferValidationSchema,
    scheduledTransferInitialValues
} ;