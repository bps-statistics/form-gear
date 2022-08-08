import { createStore } from "solid-js/store";
import { Answer, Auxiliary } from "./ResponseStore";

type Detail = {
    dataKey: string
    description?: string
    media: Answer[]
}
  
export interface Media{
    status: number,
    details: Detail & Auxiliary
}

export const [media, setMedia] = createStore<Media>({
    status: 1,
    details: {
        dataKey: '',
        media: []
    }
});

