import { createStore } from "solid-js/store";
import { Auxiliary } from "./ResponseStore";

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
    notes: Note[]
}
  
export interface Remark{
    status: number
    details: Detail & Auxiliary
}

export const [remark, setRemark] = createStore<Remark>({
    status: 1,
    details: {
        dataKey: '',
        notes: []
    }
});

