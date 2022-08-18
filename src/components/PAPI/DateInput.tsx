import { createInputMask } from "@solid-primitives/input-mask"
import dayjs from "dayjs"
import CustomParseFormat from "dayjs/plugin/customParseFormat"
import { createSignal } from "solid-js"
import { handleInputFocus, handleInputKeyDown } from "../../events"
import { FormComponentBase } from "../../FormType"
import { InputContainer } from "./partials"

dayjs.extend(CustomParseFormat)

const DateInput: FormComponentBase = props => {
  const config = props.config
  const [disableInput] = createSignal((config.formMode > 1) ? true : props.component.disableInput)

  let classInput = 'w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400';

  const format = "DD/MM/YYYY"
  const maskingFormat = "99/99/9999"
  const formatMask = createInputMask(maskingFormat);
  let ref

  const inputMask = {
    ref,
    get value() {
      return inputMask.ref?.value;
    }
  };

  let handleOnChange = (value: any) => {
    value = dayjs(value, format, true).format("YYYY-MM-DD")
    props.onValueChange(value)
  }

  let settedValue = (props.value) ? dayjs(props.value).format(format) : ""

  return (
    <InputContainer component={props.component} classValidation={props.classValidation} validationMessage={props.validationMessage}>
      <input value={settedValue} type="text"
        id={"inputMask" + props.component.dataKey} ref={inputMask.ref}
        class={classInput}
        classList={{
          ' border border-solid border-gray-300 ': props.classValidation === 0,
          ' border-orange-500 dark:bg-orange-100 ': props.classValidation === 1,
          ' border-pink-600 dark:bg-pink-100 ': props.classValidation === 2,
        }}
        placeholder={maskingFormat.replace(/[a]/g, '__').replace(/[9]/g, '#')}
        disabled={disableInput()}
        onKeyDown={(e) => handleInputKeyDown(e, props)}
        onFocus={(e) => handleInputFocus(e, props)}
        onChange={(e) => handleOnChange(e.currentTarget.value)}
        onclick={formatMask} oninput={formatMask} onpaste={formatMask}
      />
    </InputContainer>
  )
}

export default DateInput