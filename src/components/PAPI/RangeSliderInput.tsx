import { createSignal, For, Match, Show, Switch } from "solid-js"
import { FormComponentBase } from "../../FormType";
import { InputContainer } from "./partials";

const RangeSliderInput: FormComponentBase = props => {

  const config = props.config
  const [disableInput] = createSignal((config.formMode > 1) ? true : props.component.disableInput)

  let classInput = 'w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400';

  return (
    <InputContainer component={props.component} classValidation={props.classValidation} validationMessage={props.validationMessage}>
      <input value={props.value || 0}
        type="number"
        class={classInput}
        classList={{
          ' border border-solid border-gray-300 ': props.classValidation === 0,
          ' border-orange-500 dark:bg-orange-100 ': props.classValidation === 1,
          ' border-pink-600 dark:bg-pink-100 ': props.classValidation === 2,
        }}
        min={props.component.rangeInput[0].min}
        max={props.component.rangeInput[0].max}
        step={props.component.rangeInput[0].step}
        disabled={disableInput()}
        onChange={(e) => props.onValueChange(e.currentTarget.value)} />
    </InputContainer>
  )
}

export default RangeSliderInput