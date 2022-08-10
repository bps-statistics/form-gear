import { createStore } from "solid-js/store";
import { Validations } from "./ReferenceStore";

type TestFunction = {
    dataKey: string;
    name: string
    validations?: Validations[]
    componentValidation?: string[]
}

type Detail = {
    description: string;
    dataKey: string;
    version: string;
    testFunctions: TestFunction[];
}
  
export interface Validation{
    status: number,
    details: Detail
}

export const [validation, setValidation] = createStore<Validation>({
    status: 1,
    details: {
        description: '',
        dataKey: '',
        version: '',
        testFunctions: []
    }
});
