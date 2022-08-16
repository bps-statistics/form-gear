import { Component } from "solid-js";
import { ComponentType, Option } from "../../../FormType";
import InputContainer from "./InputContainer";
import OptionSection from "./OptionSection";

export {
    InputContainer,
    OptionSection
}

export interface OptionSectionBase extends Component<{
    component: ComponentType
    options: Option[]
    settedValue: any,
    onValueChange?: (value: any, label: any) => void
    disableInput: boolean
    value?: any
}> { }