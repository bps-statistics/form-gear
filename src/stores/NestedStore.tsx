import { createStore } from "solid-js/store";
import { Reference } from "./ReferenceStore";

export const [nested, setNested] = createStore<Reference>({
    details: []
});

