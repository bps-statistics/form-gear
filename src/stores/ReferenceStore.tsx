import { createStore } from "solid-js/store";
import { Component } from "./TemplateStore";
import { Detail as SidebarDetail } from "./SidebarStore";
import { LengthInput } from "../FormType";

export type Validations = {
    test: string
    message: string
    type: number //1 warning 2 invalid
}

type Detail = {
    dataKey: string
    label: string
    hint: string
    description: string
    type: number
    answer?: any
    index: []
    level: number
    options?: []
    components?: Component,
    sourceQuestion?: string,
    currency?: string,
    source?: string,
    urlPath?: string,
    parent?: string,
    separatorFormat?: string,
    isDecimal?: boolean,
    maskingFormat?: string
    expression?: string
    componentVar?: string[]
    render?: boolean
    renderType?: number
    enable?: boolean
    enableCondition?: string
    componentEnable?: string[]
    enableRemark?: boolean
    client?: string
    titleModalDelete?: string
    contentModalDelete?: string
    validationState?: number //0 valid 1 warning 2 invalid
    validationMessage?: string[]
    validations?: Validations[]
    componentValidation?: string[]
    hasRemark?: boolean
    lengthInput?: LengthInput[]
    principal?: number //start with 1
    columnName?: string
    titleModalConfirmation: string
    contentModalConfirmation: string
    required: boolean
    rangeInput: any
    presetMaster?: boolean
    sourceOption?: any
    disableInitial?: boolean
}

export interface Reference {
    details: Detail[]
    sidebar: SidebarDetail[]
}

export const [reference, setReference] = createStore<Reference>({
    details: [],
    sidebar: []
});

export const [referenceMap, setReferenceMap] = createStore({})
