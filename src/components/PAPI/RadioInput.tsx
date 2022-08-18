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

	let classInput = 'w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400';

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
		<InputContainer validationMessage={props.validationMessage} component={props.component} optionSection={optionSection}>
			<Show when={props.component.lengthInput === undefined}>
				<input value={settedValue} type="text"
					name={props.component.dataKey}
					class={classInput}
					classList={{
						' border border-solid border-gray-300 ': props.classValidation === 0,
						' border-orange-500 dark:bg-orange-100 ': props.classValidation === 1,
						' border-pink-600 dark:bg-pink-100 ': props.classValidation === 2,
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
					class={classInput}
					classList={{
						' border border-solid border-gray-300 ': props.classValidation === 0,
						' border-orange-500 dark:bg-orange-100 ': props.classValidation === 1,
						' border-pink-600 dark:bg-pink-100 ': props.classValidation === 2,
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