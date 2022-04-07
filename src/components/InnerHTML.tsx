import { FormComponentBase } from "../FormType"

const DateInput: FormComponentBase = props => {
  return (
    <div innerHTML={props.component.label} />
  )
}

export default DateInput