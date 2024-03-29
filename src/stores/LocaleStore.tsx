import { createStore } from "solid-js/store";

export type Language = {
    componentAdded: string
    componentDeleted: string
    componentEdited: string
    componentEmpty: string
    componentNotAllowed: string
    componentRendered: string
    componentSelected: string
    fetchFailed: string
    fileInvalidFormat: string
    fileInvalidMaxSize: string
    fileInvalidMinSize: string
    fileUploaded: string
    locationAcquired: string
    remarkAdded: string
    remarkEmpty: string
    submitEmpty: string
    submitInvalid: string
    submitWarning: string
    summaryAnswer: string
    summaryBlank: string
    summaryError: string
    summaryRemark: string
    uploadImage: string
    uploadCsv: string
    validationDate: string
    validationInclude: string,
    validationMax: string
    validationMaxLength: string
    validationMin: string
    validationMinLength: string
    validationRequired: string
    validationStep: string
    verificationInvalid: string
    verificationSubmitted: string
    validationUrl: string
    validationEmail: string
    validationApi: string
    errorSaving: string
    errorExpression: string
    errorEnableExpression: string
    errorValidationExpression: string
}

export type Locale = {
    language: Language[]
}

export interface Questionnaire {
    status: number
    details: Locale
}

export const [locale, setLocale] = createStore<Questionnaire>({
    status: 1,
    details: {
        language: [
            {
                componentAdded: "The component was successfully added!",
                componentDeleted: "The component was successfully deleted!",
                componentEdited: "The component was successfully edited!",
                componentEmpty: "The component can not be empty",
                componentNotAllowed: "Only 1 component is allowed to edit",
                componentRendered: "Related components is rendering, please wait.",
                componentSelected: "This component has already being selected",
                fetchFailed: "Failed to fetch the data.",
                fileInvalidFormat: "Please submit the appropriate format!",
                fileInvalidMaxSize: "The maximum of allowed size is ",
                fileInvalidMinSize: "The minimum of allowed size is ",
                fileUploaded: "File uploaded successfully!",
                locationAcquired: "Location successfully acquired!",
                remarkAdded: "The remark was successfully added!",
                remarkEmpty: "The remark can not be empty!",
                submitEmpty: "Please make sure your submission is fully filled",
                submitInvalid: "Please make sure your submission is valid",
                submitWarning: "The submission you are about to submit still contains a warning",
                summaryAnswer: "Answer",
                summaryBlank: "Blank",
                summaryError: "Error",
                summaryRemark: "Remark",
                uploadCsv: "Upload CSV file",
                uploadImage: "Upload image file",
                validationDate: "Invalid date format",
                validationInclude: "Allowed values are $values",
                validationMax: "The biggest value is",
                validationMaxLength: "The maximum of allowed character is",
                validationMin: "The smallest value is",
                validationMinLength: "The minimum of allowed character is",
                validationRequired: "Required",
                validationStep: "The value must be a multiple of",
                verificationInvalid: "Please provide verification correctly",
                verificationSubmitted: "The data is now being submitted. Thank you!",
                validationUrl: "Invalid URL address, please provide with https://",
                validationEmail: "Invalid email address",
                validationApi: "Invalid input from api response",
                errorSaving: "Something went wrong while saving on component ",
                errorExpression: "Something went wrong while evaluating expression on component ",
                errorEnableExpression: "Something went wrong while evaluating enable on component ",
                errorValidationExpression: "Something went wrong while evaluating validation expression on component "
            }
        ]
    }
});