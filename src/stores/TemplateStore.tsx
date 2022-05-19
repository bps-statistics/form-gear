import { createStore } from "solid-js/store";
import { Validations } from "./ReferenceStore";
import { LengthInput } from "../FormType";
import { Language } from "./LocaleStore";

export type Component = {
    label: string
    dataKey: string
    type: string
    currency?: string
    source?: string
    path?: string
    parent?: string
    separatorFormat?: string
    isDecimal?: boolean
    maskingFormat?: string
    client?: string
    validationState?: number //0 valid 1 warning 2 invalid
    validationMessage?: string[]
    validations?: Validations[]
    componentValidation?: string[]
    lengthInput?: LengthInput[]
    principal?: number //start with 1
    columnName?: string
    titleModalConfirmation: string
    contentModalConfirmation: string
    presetMaster?: boolean
    disableInitial?: boolean
}

export type Detail = {
    description: string
    dataKey: string
    acronym: string
    title: string
    version: string
    components: Component[][],
    language?: Language[]
}
  
export interface Questionnaire{
    status: number
    details: Detail
}

export const [template, setTemplate] = createStore<Questionnaire>({
    status: 1,
    details: {
        description: '',
        dataKey: '',
        acronym: '',
        title: '',
        version: '',
        components: []
    }
});