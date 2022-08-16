import { createSignal, Show, For, Switch, Match } from "solid-js"
import { handleInputFocus, handleInputKeyDown } from "../../events"
import { FormComponentBase } from "../../FormType"
import { InputContainer } from "./partials"

const NumberInput: FormComponentBase = props => {
  const config = props.config
  const [disableInput] = createSignal((config.formMode > 1) ? true : props.component.disableInput)

  let classInput = 'w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400';

  return (
    <InputContainer validationMessage={props.validationMessage} component={props.component}>
      <Show when={props.component.lengthInput === undefined}>
        <input value={props.value} type="number"
          name={props.component.dataKey}
          class={classInput}
          classList={{
            ' border border-solid border-gray-300 ': props.classValidation === 0,
            ' border-orange-500 dark:bg-orange-100 ': props.classValidation === 1,
            ' border-pink-600 dark:bg-pink-100 ': props.classValidation === 2,
          }}
          placeholder=""
          disabled={disableInput()}
          onChange={(e) => {
            props.onValueChange(e.currentTarget.value);
          }}
          onFocus={(e) => handleInputFocus(e, props)}
          onKeyDown={(e) => handleInputKeyDown(e, props)} />
      </Show>
      <Show when={props.component.lengthInput !== undefined && props.component.lengthInput.length > 0}>
        <input value={props.value} type="number"
          name={props.component.dataKey}
          class={classInput}
          classList={{
            ' border border-solid border-gray-300 ': props.classValidation === 0,
            ' border-orange-500 dark:bg-orange-100 ': props.classValidation === 1,
            ' border-pink-600 dark:bg-pink-100 ': props.classValidation === 2,
          }}
          placeholder=""
          disabled={disableInput()}
          onChange={(e) => {
            props.onValueChange(e.currentTarget.value);
          }}
          onFocus={(e) => handleInputFocus(e, props)}
          onKeyDown={(e) => handleInputKeyDown(e, props)}
          oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
          maxlength={props.component.lengthInput[0].maxlength !== undefined ? props.component.lengthInput[0].maxlength : ''}
          minlength={props.component.lengthInput[0].minlength !== undefined ? props.component.lengthInput[0].minlength : ''}
          max={props.component.rangeInput ? props.component.rangeInput[0].max !== undefined ? props.component.rangeInput[0].max : '' : ''}
          min={props.component.rangeInput ? props.component.rangeInput[0].min !== undefined ? props.component.rangeInput[0].min : '' : ''}
        />
      </Show>
    </InputContainer>
  )
}

export default NumberInput