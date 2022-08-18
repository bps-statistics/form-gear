import { createStore } from "solid-js/store";

type Input = {
    currentDataKey: string
}

export const [input, setInput] = createStore<Input>({
    currentDataKey: ""
});