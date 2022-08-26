import { createStore } from "solid-js/store";

export type Counter = {
    render: number,
    validate: number
}

export const [counter, setCounter] = createStore<Counter>({
    render: 0,
    validate: 0
});