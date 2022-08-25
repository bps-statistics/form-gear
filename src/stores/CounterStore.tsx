import { createStore } from "solid-js/store";

export type Counter = {
    rendered: number,
    validated: number
}

export const [counter, setCounter] = createStore<Counter>({
    rendered: 0,
    validated: 0
});