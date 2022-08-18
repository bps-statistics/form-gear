import { createInputMask } from "@solid-primitives/input-mask"
import { createMemo, createSignal, For, Match, Show, Switch } from "solid-js"
import { ClientMode } from "../../constants"
import { handleInputFocus, handleInputKeyDown } from "../../events"
import { FormComponentBase } from "../../FormType"
import { InputContainer } from "./partials"

const DateInput: FormComponentBase = props => {
  const config = props.config
  const [disableInput] = createSignal((config.formMode > 1) ? true : props.component.disableInput)

  let classInput = 'w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400';

  const [instruction, setInstruction] = createSignal(false);
  const showInstruction = () => {
    (instruction()) ? setInstruction(false) : setInstruction(true);
  }

  const [disableClickRemark] = createSignal((config.formMode > 2 && props.comments == 0) ? true : false);
  const [enableRemark] = createSignal((props.component.enableRemark !== undefined ? props.component.enableRemark : true) && config.clientMode != ClientMode.PAPI);

  const changeFormat = (value: any, isReverse: boolean = false) => {
    const splittedChar = isReverse ? "-" : "/"
    const joinChar = isReverse ? "/" : "-"
    const splitted = value.split(splittedChar)
    splitted.reverse()
    value = splitted.join(joinChar)
    return value
  }

  let handleOnChange = (value: any) => {
    value = changeFormat(value)
    props.onValueChange(value)
  }

  const maskingFormat = "99/99/9999"
  const formatMask = createInputMask(maskingFormat);
  let ref

  const inputMask = {
    ref,
    get value() {
      return inputMask.ref?.value;
    }
  };

  let settedValue = (props.value) ? changeFormat(props.value, true) : ""


  let today = new Date();
  let dd = String(today.getDate());
  let mm = String(today.getMonth() + 1); //January is 0!
  let yyyy = String(today.getFullYear());
  if (Number(dd) < 10) {
    dd = '0' + dd
  }
  if (Number(mm) < 10) {
    mm = '0' + mm
  }

  let todayDate = yyyy + '-' + mm + '-' + dd;

  let minDate: any, maxDate: any;
  createMemo(() => {
    if (props.component.rangeInput) {
      minDate = (props.component.rangeInput[0].min !== undefined) ? (props.component.rangeInput[0].min === 'today') ? todayDate : props.component.rangeInput[0].min : '';
      maxDate = (props.component.rangeInput[0].max !== undefined) ? (props.component.rangeInput[0].max === 'today') ? todayDate : props.component.rangeInput[0].max : '';
    }
  })

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