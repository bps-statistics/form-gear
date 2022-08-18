import { createSignal, For, Match, Show, Switch } from "solid-js"
import { FormComponentBase } from "../../FormType"
import { InputContainer } from "./partials"

const TextAreaInput: FormComponentBase = props => {
  const config = props.config
  const [disableInput] = createSignal((config.formMode > 1) ? true : props.component.disableInput)

  return (
    <InputContainer component={props.component} classValidation={props.classValidation} validationMessage={props.validationMessage}>
      <Show when={props.component.lengthInput === undefined}>
        <textarea value={props.value}
          rows={props.component.rows || 2}
          class="formgear-input-papi"
          classList={{
            ['formgear-input-papi-validation-' + props.classValidation]: true
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
          class="formgear-input-papi"
          classList={{
            ['formgear-input-papi-validation-' + props.classValidation]: true
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