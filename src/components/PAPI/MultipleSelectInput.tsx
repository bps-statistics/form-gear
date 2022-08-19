import { createMemo, createSignal, Show } from "solid-js"
import { handleInputFocus, handleInputKeyDown } from "../../events"
import { FormComponentBase, Option } from "../../FormType"
import { findSumCombination, sum, transformCheckboxOptions } from "../../GlobalFunction"
import { reference } from '../../stores/ReferenceStore'
import { InputContainer } from "./partials"
import MultipleOptionSection from "./partials/MultipleOptionSection"

const MultipleSelectInput: FormComponentBase = props => {
    const config = props.config
    const [disableInput] = createSignal((config.formMode > 1) ? true : props.component.disableInput)


    let getOptions = createMemo(() => {
        if (props.component.sourceOption !== undefined && props.component.typeOption === 3) {
            let newSourceOption = props.component.sourceOption.split('@');
            const componentAnswerIndex = reference.details.findIndex(obj => obj.dataKey === newSourceOption[0]);
            if ((reference.details[componentAnswerIndex].type === 21 || 22 || 23 || 26 || 27 || 29)
                || (reference.details[componentAnswerIndex].type === 4 && reference.details[componentAnswerIndex].renderType === 2)) {
                return reference.details[componentAnswerIndex].answer
            }
        }
        return []
    })

    const [options] = createSignal<Option[]>(props.component.sourceOption !== undefined ? getOptions() : props.component.options);

    let handleOnChange = (value: any, label?: string, open?: boolean) => {
        let updatedAnswer
        if (open == undefined) {
            const checkboxOptions = transformCheckboxOptions(options())
            const optionValue = checkboxOptions.map(item => Number(item.checkboxValue))
            const sumCombination = findSumCombination(Number(value), optionValue)

            if (sumCombination.length > 0) {
                updatedAnswer = checkboxOptions.filter((option: any) => sumCombination.includes(Number(option.checkboxValue))).map(it => {
                    delete it.checkboxValue
                    return it
                })
            }
        } else {
            updatedAnswer = JSON.parse(JSON.stringify(props.value))
            if (updatedAnswer) {
                if (props.value.some(d => String(d.value) === String(value))) {
                    if (open) {
                        let valueIndex = options().findIndex((item) => item.value == value);
                        updatedAnswer = updatedAnswer.filter((item) => item.value != value)
                        if (options()[valueIndex].label !== label) updatedAnswer.push({ value: value, label: label })
                    } else {
                        updatedAnswer = updatedAnswer.filter((item) => item.value != value)
                    }
                } else {
                    updatedAnswer.splice(updatedAnswer.length, 0, { value: value, label: label })
                }
            } else {
                updatedAnswer = [];
                updatedAnswer.push({ value: value, label: label })
            }
        }
        props.onValueChange(updatedAnswer);
    }

    const transformedValue = createMemo(() => {
        if (props.value?.length > 0) {
            return transformCheckboxOptions(options())
                .filter((option: Option) =>
                    props.value.find((value: any) =>
                        option.value === value.value && option.label === value.label
                    ))
        }
        return []
    })

    const settedValue = createMemo(() => {
        if (props.value?.length > 0) {
            return sum(transformedValue().map((it: any) => it.checkboxValue))
        }
        return props.value
    })

    const optionSection = () => {
        return (
            <MultipleOptionSection
                component={props.component}
                options={options()}
                settedValue={settedValue()}
                onValueChange={handleOnChange}
                disableInput={disableInput()}
                value={props.value}
            />
        )
    }

    return (
        <InputContainer validationMessage={props.validationMessage} component={props.component} optionSection={optionSection}>
            <Show when={props.component.lengthInput === undefined}>
                <input value={settedValue()} type="text"
                    name={props.component.dataKey}
                    class="formgear-input-papi"
                    classList={{
                        ['formgear-input-papi-validation-' + props.classValidation]: true
                    }}
                    placeholder=""
                    disabled={disableInput()}
                    onChange={(e) => {
                        handleOnChange(e.currentTarget.value);
                    }}
                    onFocus={(e) => handleInputFocus(e, props)}
                    onKeyDown={(e) => handleInputKeyDown(e, props)}
                />
            </Show>
            <Show when={props.component.lengthInput !== undefined && props.component.lengthInput.length > 0}>
                <input value={settedValue()} type="text"
                    name={props.component.dataKey}
                    class="formgear-input-papi"
                    classList={{
                        ['formgear-input-papi-validation-' + props.classValidation]: true
                    }}
                    placeholder=""
                    disabled={disableInput()}
                    onChange={(e) => {
                        props.onValueChange(e.currentTarget.value);
                    }}
                    onFocus={(e) => handleInputFocus(e, props)}
                    onKeyDown={(e) => handleInputKeyDown(e, props)}
                    maxlength={props.component.lengthInput[0].maxlength !== undefined ? props.component.lengthInput[0].maxlength : ''}
                    minlength={props.component.lengthInput[0].minlength !== undefined ? props.component.lengthInput[0].minlength : ''}
                />
            </Show>
        </InputContainer>
    )

}

export default MultipleSelectInput