import { createMemo, createSignal, Show } from "solid-js";
import { handleInputFocus, handleInputKeyDown } from "../../events";
import { FormComponentBase, Option } from "../../FormType";
import { reference } from '../../stores/ReferenceStore';
import { InputContainer, OptionSection } from "./partials";

const RadioInput: FormComponentBase = props => {
	const config = props.config
	const [disableInput] = createSignal((config.formMode > 1) ? true : props.component.disableInput)

	let settedValue = (props.value) ? props.value.length > 0 ? props.value[0].value : props.value : props.value

	let handleOnChange = (value: any, label: any = null) => {
		let updatedAnswer = []
		if (label == null) {
			label = options().find(it => it.value == value)?.label
		}
		updatedAnswer = [{ value, label }]
		props.onValueChange([...updatedAnswer])
	}

	let getOptions = createMemo(() => {
		if (props.component.sourceOption !== undefined && props.component.typeOption === 3) {
			let newSourceOption = props.component.sourceOption.split('@');
			const componentAnswerIndex = reference.details.findIndex(obj => obj.dataKey === newSourceOption[0]);
			if ((reference.details[componentAnswerIndex].type === 21 || 22 || 23 || 26 || 27 || 29)
				|| (reference.details[componentAnswerIndex].type === 4 && reference.details[componentAnswerIndex].renderType === 2)) {
				return reference.details[componentAnswerIndex].answer
			}
		}
		return []
	})

	const [options] = createSignal<Option[]>(props.component.sourceOption !== undefined ? getOptions() : props.component.options);

	const optionSection = () => {
		return (
			<OptionSection
				component={props.component}
				options={options()}
				settedValue={settedValue}
				onValueChange={handleOnChange}
				disableInput={disableInput()}
				value={props.value}
			/>
		)
	}

	return (
		<InputContainer classValidation={props.classValidation} validationMessage={props.validationMessage} component={props.component} optionSection={optionSection}>
			<Show when={props.component.lengthInput === undefined}>
				<input value={settedValue} type="text"
					name={props.component.dataKey}
					class="formgear-input-papi"
					classList={{
						['formgear-input-papi-validation-' + props.classValidation]: true
					}}
					placeholder=""
					disabled={disableInput()}
					onChange={(e) => {
						handleOnChange(e.currentTarget.value);
					}}
					onFocus={(e) => handleInputFocus(e, props)}
					onKeyDown={(e) => handleInputKeyDown(e, props)}
				/>
			</Show>
			<Show when={props.component.lengthInput !== undefined && props.component.lengthInput.length > 0}>
				<input value={settedValue} type="text"
					name={props.component.dataKey}
					class="formgear-input-papi"
					classList={{
						['formgear-input-papi-validation-' + props.classValidation]: true
					}}
					placeholder=""
					disabled={disableInput()}
					onChange={(e) => {
						props.onValueChange(e.currentTarget.value);
					}}
					onFocus={(e) => handleInputFocus(e, props)}
					onKeyDown={(e) => handleInputKeyDown(e, props)}
					maxlength={props.component.lengthInput[0].maxlength !== undefined ? props.component.lengthInput[0].maxlength : ''}
					minlength={props.component.lengthInput[0].minlength !== undefined ? props.component.lengthInput[0].minlength : ''}
				/>
			</Show>
		</InputContainer>
	)
}
export default RadioInput;