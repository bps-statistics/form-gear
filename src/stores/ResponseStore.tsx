import { createStore } from "solid-js/store";
import { Summary } from "./SummaryStore";

export type Answer = {
    dataKey: string
    name: string
    answer: any
}

export type Auxiliary = {    
    templateDataKey?: string
    gearVersion?: string
    templateVersion?: string
    validationVersion?: string
    createdBy?: string
    updatedBy?: string
    createdAt?: any
    updatedAt?: any
    createdAtTimezone?: string
    createdAtGMT?: number
    updatedAtTimezone?: string
    updatedAtGMT?: number
}

type Detail = {
    dataKey: string
    description?: string
    docState?: string
    answers: Answer[]
    summary: Summary[]
}
  
export interface Response{
    status: number,
    details: Detail & Auxiliary
}

export const [response, setResponse] = createStore<Response>({
    status: 1,
    details: {
        dataKey: '',
        answers: [],
        summary: [],
    }
});

