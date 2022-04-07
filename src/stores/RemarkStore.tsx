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
        notes: []
    }
});

