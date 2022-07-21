import { createStore } from "solid-js/store";

export interface Summary {    
    answer: number
    blank: number
    error: number
    remark: number
    clean : number
}

export const [summary, setSummary] = createStore<Summary>({
    answer: 0,
    blank: 0,
    error: 0,
    remark: 0,
    clean: 0,
});

