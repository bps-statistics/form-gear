import { createStore } from "solid-js/store";
import { Component } from "./TemplateStore";
import { Detail as SidebarDetail } from "./SidebarStore";
import { LengthInput } from "../FormType";
import { createSignal } from "solid-js";

export type Validations = {
    test: string
    message: string
    type: number //1 warning 2 invalid
}

type Detail = {
    dataKey: string
    name: string
    label: string
    hint: string
    description: string
    type: number
    answer?: any
    index: []
    level: number
    options?: []
    components?: Component,
    rows?: number,                 
    cols?: number,
    sourceQuestion?: string,
    urlValidation?: string,
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

export const [referenceMap, setReferenceMap] = createSignal({})
export const [sidebarIndexMap, setSidebarIndexMap] = createSignal({})

export const [compEnableMap, setCompEnableMap] = createSignal({})
export const [compValidMap, setCompValidMap] = createSignal({})
export const [compSourceOptionMap, setCompSourceOptionMap] = createSignal({})
export const [compVarMap, setCompVarMap] = createSignal({})
export const [compSourceQuestionMap, setCompSourceQuestionMap] = createSignal({})

export const [referenceHistoryEnable, setReferenceHistoryEnable] = createSignal(false)
export const [referenceHistory, setReferenceHistory] = createSignal([])
export const [sidebarHistory, setSidebarHistory] = createSignal([])
export const [referenceEnableFalse, setReferenceEnableFalse] = createSignal([])
