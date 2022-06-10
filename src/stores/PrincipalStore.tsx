import { createStore } from "solid-js/store";

type PrincipalComponent = {
    dataKey: string
    answer: any
    principal: number //start with 1
    columnName: string
}

type Detail = {
    templateDataKey: string
    gearVersion: string
    templateVersion: string
    validationVersion: string
    createdBy: string
    updatedBy: string
    createdAt: any
    updatedAt: any
    createdAtTimezone: string
    createdAtGMT: number
    updatedAtTimezone: string
    updatedAtGMT: number
    principals: PrincipalComponent[]
}
  
export interface Principals{
    status: number,
    details: Detail
}

export const [principal, setPrincipal] = createStore<Principals>({
    status: 1,
    details: {
        templateDataKey: '',
        gearVersion: '',
        templateVersion: '',
        validationVersion: '',
        createdBy: '',
        updatedBy: '',
        createdAt: '',
        updatedAt: '',
        createdAtTimezone: '',
        createdAtGMT: null,
        updatedAtTimezone: '',
        updatedAtGMT: null,
        principals: []
    }
});

