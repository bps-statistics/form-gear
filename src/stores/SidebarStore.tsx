import { createStore } from "solid-js/store";
import { Component } from "./TemplateStore";

type Detail = {
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

interface Sidebar {
    details: Detail[]
}

export const [sidebar, setSidebar] = createStore<Sidebar>({
    details: []
});

