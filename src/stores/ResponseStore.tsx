import { createStore } from "solid-js/store";
import { Summary } from "./SummaryStore"

type Answer = {
    dataKey: string;
    answer: any;
}

type Detail = {
    description: string
    dataKey: string
    templateDataKey: string
    gearVersion: string
    templateVersion: string
    validationVersion: string
    docState?: string
    createdBy: string
    updatedBy: string
    createdAt: any
    updatedAt: any
    answers: Answer[]
    summary: Summary[]
}
  
export interface Response{
    status: number,
    details: Detail
}

export const [response, setResponse] = createStore<Response>({
    status: 1,
    details: {
        description: '',
        dataKey: '',
        templateDataKey: '',
        gearVersion: '',
        templateVersion: '',
        validationVersion: '',
        createdBy: '',
        updatedBy: '',
        createdAt: '',
        updatedAt: '',
        answers: [],
        summary: [],
    }
});

