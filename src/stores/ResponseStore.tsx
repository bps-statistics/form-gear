import { createStore } from "solid-js/store";
import { Summary } from "./SummaryStore"

type Answer = {
    dataKey: string;
    answer: any;
}

type Detail = {
    description: string;
    dataKey: string;
    templateVersion: string;
    validationVersion: string;
    docState?: string;
    createdBy: string;
    editedBy: string;
    createdAt: any;
    lastUpdated: any;
    answers: Answer[];
    summary: Summary[];
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
        templateVersion: '',
        validationVersion: '',
        createdBy: '',
        editedBy: '',
        createdAt: '',
        lastUpdated: '',
        answers: [],
        summary: [],
    }
});

