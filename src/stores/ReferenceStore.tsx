import { createStore } from "solid-js/store";
import { Component } from "./TemplateStore";

export type Validations = {
    test: string
    message: string
    type: number //1 1 warning 2 invalid
    // component: string[]
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
}

export interface Reference {
    details: Detail[]
}

export const [reference, setReference] = createStore<Reference>({
    details: []
});

