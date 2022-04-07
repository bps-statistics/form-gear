import { createStore } from "solid-js/store";
import { Remark } from "../stores/RemarkStore";

export const [note, setNote] = createStore<Remark>({
    status: 1,
    details: {
        dataKey: '',
        notes: []
    }
});

