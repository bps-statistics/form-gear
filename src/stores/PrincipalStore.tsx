import { createStore } from "solid-js/store";
import { Auxiliary } from "./ResponseStore";

type Principal = {
    dataKey: string
    name: string
    answer: any
    principal: number //start with 1
    columnName: string
}

type Detail = {
    principals: Principal[]
}
  
export interface Principals{
    status: number,
    details: Detail & Auxiliary
}

export const [principal, setPrincipal] = createStore<Principals>({
    status: 1,
    details: {
        principals: []
    }
});

