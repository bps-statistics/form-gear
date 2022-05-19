import { createStore } from "solid-js/store";
import { Component } from "./TemplateStore";

export type Detail = {
    dataKey: string
    label: string
    description: string
    level: number,
    index: number[],
    components: Component,
    sourceQuestion?: string,
    enable: boolean,
    enableCondition: string,
    componentEnable: string[]
}

export interface Sidebar {
    details: Detail[]
}

export const [sidebar, setSidebar] = createStore<Sidebar>({
    details: []
});

