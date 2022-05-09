import { createStore } from "solid-js/store";

type PrincipalComponent = {
    dataKey: string
    answer: any
    principal: number //start with 1
    columnName: string
}

type Detail = {
    templateVersion: string;
    createdBy: string;
    createdAt: any;
    principals: PrincipalComponent[];
}
  
export interface Principals{
    status: number,
    details: Detail
}

export const [principal, setPrincipal] = createStore<Principals>({
    status: 1,
    details: {
        templateVersion: '',
        createdBy: '',
        createdAt: '',
        principals: []
    }
});

