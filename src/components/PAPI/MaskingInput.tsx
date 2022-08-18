import { createSignal, createEffect, For, Show, Switch, Match } from "solid-js"
import { FormComponentBase } from "../../FormType"
import { createInputMask } from "@solid-primitives/input-mask"
import { InputContainer } from "./partials"

const MaskingInput: FormComponentBase = props => {
  const config = props.config
  const [disableInput] = createSignal((config.formMode > 1) ? true : props.component.disableInput)

  let classInput = 'w-full border-gray-300 rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400';

  const formatMask = createInputMask(props.component.maskingFormat);
  let ref

  const inputMask = {
    ref,
    get value() {
      return inputMask.ref?.value;
    }
  };
  
  let handleOnChange = (value: any) => {
    props.onValueChange(value)
  }

  createEffect(() => {
    document.getElementById("inputMask" + props.component.dataKey).click()

  })

  return (
    <InputContainer component={props.component} classValidation={props.classValidation} validationMessage={props.validationMessage}>
      <input value={props.value} type="text"
        id={"inputMask" + props.component.dataKey} ref={inputMask.ref}
        class={classInput}
        placeholder={props.component.maskingFormat.replace(/[a]/g, '__').replace(/[9]/g, '#')}
        disabled={disableInput()}
        onChange={(e) => handleOnChange(e.currentTarget.value)}
        onclick={formatMask} oninput={formatMask} onpaste={formatMask}
      />
    </InputContainer>
  )
}

// transition ease-in-out m-0
// focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"

export default MaskingInput