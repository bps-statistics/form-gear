import { createSignal, For, Match, Show, Switch } from "solid-js"
import { FormComponentBase } from "../../FormType"
import { InputContainer } from "./partials"

const TextAreaInput: FormComponentBase = props => {
  const config = props.config
  const [disableInput] = createSignal((config.formMode > 1) ? true : props.component.disableInput)

  let classInput = 'w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400';
  
  return (
    <InputContainer component={props.component} classValidation={props.classValidation} validationMessage={props.validationMessage}>
      <Show when={props.component.lengthInput === undefined}>
        <textarea value={props.value}
          rows={props.component.rows || 2}
          class={classInput}
          classList={{
            ' border border-solid border-gray-300 ': props.classValidation === 0,
            ' border-orange-500 dark:bg-orange-100 ': props.classValidation === 1,
            ' border-pink-600 dark:bg-pink-100 ': props.classValidation === 2,
          }}
          disabled={disableInput()}
          onChange={(e) => {
            props.onValueChange(e.currentTarget.value)
          }}
        />
      </Show>
      <Show when={props.component.lengthInput !== undefined && props.component.lengthInput.length > 0}>
        <textarea value={props.value}
          rows={props.component.rows || 2}
          class={classInput}
          classList={{
            ' border border-solid border-gray-300 ': props.classValidation === 0,
            ' border-orange-500 dark:bg-orange-100 ': props.classValidation === 1,
            ' border-pink-600 dark:bg-pink-100 ': props.classValidation === 2,
          }}
          disabled={disableInput()}
          onChange={(e) => {
            props.onValueChange(e.currentTarget.value)
          }}
          maxlength={props.component.lengthInput[0].maxlength !== undefined ? props.component.lengthInput[0].maxlength : ''}
          minlength={props.component.lengthInput[0].minlength !== undefined ? props.component.lengthInput[0].minlength : ''}
        />
      </Show>
    </InputContainer>
  )
}

export default TextAreaInput