import { createStore } from "solid-js/store";

type Predata = {
    dataKey: string;
    name: string
    answer: any;
}

type Detail = {
    description: string;
    dataKey: string;
    predata: Predata[];
}
  
export interface Preset{
    status: number,
    details: Detail
}

export const [preset, setPreset] = createStore<Preset>({
    status: 1,
    details: {
        description: '',
        dataKey: '',
        predata: []
    }
});

