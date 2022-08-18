import { createInputMask } from "@solid-primitives/input-mask";
import dayjs from "dayjs";
import CustomParseFormat from "dayjs/plugin/customParseFormat";
import { createSignal } from "solid-js";
import { FormComponentBase } from "../../FormType";
import { InputContainer } from "./partials";

dayjs.extend(CustomParseFormat)

const DateTimeLocalInput: FormComponentBase = props => {
  const config = props.config
  const [disableInput] = createSignal((config.formMode > 1) ? true : props.component.disableInput)

  const format = "DD/MM/YYYY HH:mm:ss"
  const maskingFormat = "99/99/9999 99:99:99"
  const formatMask = createInputMask(maskingFormat);
  let ref

  const inputMask = {
    ref,
    get value() {
      return inputMask.ref?.value;
    }
  };

  let handleOnChange = (value: any) => {
    value = dayjs(value, format, true).format("YYYY-MM-DD HH:mm:ss")
    props.onValueChange(value)
  }

  let settedValue = (props.value) ? dayjs(props.value).format(format) : ""


  return (
    <InputContainer component={props.component} classValidation={props.classValidation} validationMessage={props.validationMessage}>
      <input value={settedValue} type="text"
        id={"inputMask" + props.component.dataKey} ref={inputMask.ref}
        class="formgear-input-papi"
        classList={{
          ['formgear-input-papi-validation-' + props.classValidation]: true
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

export default DateTimeLocalInput