import { createSignal, For, Match, Show, Switch } from "solid-js"
import { FormComponentBase } from "../../FormType";
import { InputContainer } from "./partials";

const RangeSliderInput: FormComponentBase = props => {

  const config = props.config
  const [disableInput] = createSignal((config.formMode > 1) ? true : props.component.disableInput)

  return (
    <InputContainer component={props.component} classValidation={props.classValidation} validationMessage={props.validationMessage}>
      <input value={props.value || 0}
        type="number"
        class="formgear-input-papi"
        classList={{
          ['formgear-input-papi-validation-' + props.classValidation]: true
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