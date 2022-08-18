import createDebounce from "@solid-primitives/debounce";
import { createSignal } from "solid-js";
import { FormComponentBase } from "../../FormType";
import { InputContainer } from "./partials";

const CurrencyInput: FormComponentBase = props => {
  const config = props.config
  const [disableInput] = createSignal((config.formMode > 1) ? true : props.component.disableInput)

  let checkFormat = (e: any) => {
    let tobeChecked = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    let templ = props.component.separatorFormat === 'id-ID' ? /^\d{1,99}(?:\,\d{0,10})?$/ : /^\d{1,99}(?:\.\d{0,10})?$/

    let value = (document.getElementById('currencyInput' + props.index) as HTMLInputElement).value;

    let currentVal = modifier(value);

    if (!templ.test(currentVal + tobeChecked)) {
      e.preventDefault ? e.preventDefault() : e.returnValue = false;
    }
  }

  let handleOnKeyup = createDebounce((value: any) => {
    let modified = modifier(value)
    let result = props.component.separatorFormat === 'id-ID' ? modified.replace(',', '.') : modified;
    props.onValueChange(result)
  }, 1000)

  let modifier = (value: any) => {
    let firstRemoved
    let allowedChars
    if (props.component.separatorFormat === 'id-ID') {
      firstRemoved = props.component.isDecimal ? value.indexOf(',00') != -1 ? value.substring(0, value.indexOf(',00')) : value : value.indexOf(',') != -1 ? value.substring(0, value.indexOf(',')) : value
      allowedChars = "0123456789,";
    } else if (props.component.separatorFormat === 'en-US') {
      firstRemoved = props.component.isDecimal ? value.indexOf('.00') != -1 ? value.substring(0, value.indexOf('.00')) : value : value.indexOf('.') != -1 ? value.substring(0, value.indexOf('.')) : value
      allowedChars = "0123456789.";
    }
    return Array.from(firstRemoved).filter((f: any) => allowedChars.includes(f)).join('')
  }

  let current = Number(props.value).toLocaleString(props.component.separatorFormat, { style: 'currency', currency: props.component.currency, minimumFractionDigits: 0 })

  return (
    <InputContainer component={props.component} classValidation={props.classValidation} validationMessage={props.validationMessage}>
      <input value={props.component.separatorFormat === 'id-ID' ? current.replace(",00", "") : current.replace("IDR", "Rp")} type="text"
        name={props.component.dataKey}
        class="formgear-input-papi"
        classList={{
          ['formgear-input-papi-validation-' + props.classValidation]: true
        }}
        placeholder=""
        disabled={disableInput()}
        id={"currencyInput" + props.index}
        onkeypress={e => checkFormat(e)}
        onkeyup={e => handleOnKeyup(e.currentTarget.value)}
        max={props.component.rangeInput ? props.component.rangeInput[0].max !== undefined ? props.component.rangeInput[0].max : '' : ''}
        min={props.component.rangeInput ? props.component.rangeInput[0].min !== undefined ? props.component.rangeInput[0].min : '' : ''}
      />
    </InputContainer>
  )
}

export default CurrencyInput
