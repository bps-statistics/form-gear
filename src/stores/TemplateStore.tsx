import { createStore } from "solid-js/store";
import { Validations } from "./ReferenceStore";

export type Component = {
    label: string;
    dataKey: string;
    type: string;
    currency?: string;
    source?: string;
    path?: string;
    parent?: string;
    separatorFormat?: string;
    isDecimal?: boolean;
    maskingFormat?: string;
    client?: string
    validationState?: number //0 valid 1 warning 2 invalid
    validationMessage?: string[]
    validations?: Validations[]
    componentValidation?: string[]
}

export type Detail = {
    description: string;
    dataKey: string;
    acronym: string;
    title: string;
    version: string;
    components: Component[][];
}
  
export interface Questionnaire{
    status: number,
    details: Detail
}

export const [template, setTemplate] = createStore<Questionnaire>({
    status: 1,
    details: {
        description: '',
        dataKey: '',
        acronym: '',
        title: '',
        version: '',
        components: []
    }
});