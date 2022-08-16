import { Component, JSXElement } from "solid-js";
import { ComponentType, Option } from "../../../FormType";
import InputContainer from "./InputContainer";
import OptionSection from "./OptionSection";

export {
    InputContainer,
    OptionSection
}

export interface InputContainerBase extends Component<{
    component: ComponentType
    optionSection?: () => JSXElement
    classValidation?: any
    validationMessage?: any
}> { }

export interface OptionSectionBase extends Component<{
    component: ComponentType
    options: Option[]
    settedValue: any,
    onValueChange?: (value: any, label: any) => void
    disableInput: boolean
    value?: any
}> { }
