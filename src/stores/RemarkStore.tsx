import { createStore } from "solid-js/store";

type Comment = {
    sender: any
    datetime: any
    comment: any
}

type Note = {
    dataKey: string
    comments: Comment[]
}

type Detail = {
    dataKey: string
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
    notes: Note[]
}
  
export interface Remark{
    status: number
    details: Detail
}

export const [remark, setRemark] = createStore<Remark>({
    status: 1,
    details: {
        dataKey: '',
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
        notes: []
    }
});

